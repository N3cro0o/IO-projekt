using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Collections.Generic;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SharedQuestionController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public SharedQuestionController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        // Pobieranie TYLKO pytań, które mają shared = true
        [HttpGet]
        public ActionResult<IEnumerable<SharedQuestion>> GetSharedQuestions()
        {
            List<SharedQuestion> questions = new List<SharedQuestion>();

            try
            {
                _connection.Open();
                string query = @"
                SELECT q.questionid, q.name, q.category, 
                    CASE WHEN qt.questionid IS NOT NULL THEN true ELSE false END AS addedToTest
                FROM ""Question"" q
                LEFT JOIN ""QuestionToTest"" qt ON q.questionid = qt.questionid
                WHERE q.shared = true;";

                using (var command = new NpgsqlCommand(query, _connection))
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var question = new SharedQuestion
                        {
                            Id = reader.GetInt32(0),
                            Name = reader.GetString(1),
                            Category = reader.GetString(2),
                            Shared = true,
                            AddedToTest = reader.GetBoolean(3)
                        };
                        questions.Add(question);
                    }
                }

                return Ok(questions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                _connection.Close();
            }
        }

        // Aktualizacja pola shared i dodanie/usunięcie pytania z testu
        [HttpPatch("{id}/{testid}")]
        public IActionResult UpdateSharedStatus(int id, int testid, [FromBody] SharedStatusUpdateRequest request)
        {
            Console.WriteLine($"Wlaczam kontroler o id{id}");
            try
            {
                _connection.Open();

                using (var transaction = _connection.BeginTransaction())
                {
                    string updateQuery = "UPDATE \"Question\" SET shared = @shared WHERE questionid = @id";
                    using (var updateCommand = new NpgsqlCommand(updateQuery, _connection))
                    {
                        updateCommand.Parameters.AddWithValue("@shared", request.Shared);
                        updateCommand.Parameters.AddWithValue("@id", id);
                        updateCommand.ExecuteNonQuery();
                    }

                    // Obsługa dodania/usunięcia pytania do/z testu
                    if (request.AddToTest)
                    {
                        string insertQuery = "INSERT INTO \"QuestionToTest\" (testid, questionid) VALUES (@testid, @id) ON CONFLICT DO NOTHING;";
                        using (var insertCommand = new NpgsqlCommand(insertQuery, _connection))
                        {
                            insertCommand.Parameters.AddWithValue("@testid", request.TestId);
                            insertCommand.Parameters.AddWithValue("@id", id);
                            insertCommand.ExecuteNonQuery();
                        }
                    }
                    else
                    {
                        string deleteQuery = "DELETE FROM \"QuestionToTest\" WHERE questionid = @id AND testid = @testid;";
                        using (var deleteCommand = new NpgsqlCommand(deleteQuery, _connection))
                        {
                            deleteCommand.Parameters.AddWithValue("@testid", request.TestId);
                            deleteCommand.Parameters.AddWithValue("@id", id);
                            deleteCommand.ExecuteNonQuery();
                        }
                    }

                    transaction.Commit();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                _connection.Close();
            }
        }
    }



    public class SharedQuestion
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public bool Shared { get; set; }
        public bool AddedToTest { get; set; }
    }

    public class SharedStatusUpdateRequest
    {
        public bool Shared { get; set; }
        public bool AddToTest { get; set; }
        public int TestId { get; set; } // Identyfikator testu
    }
}
