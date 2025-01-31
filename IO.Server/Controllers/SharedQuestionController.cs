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
        public ActionResult<IEnumerable<SharedQuestion>> GetSharedQuestions([FromQuery] string testId)
        {
            List<SharedQuestion> questions = new List<SharedQuestion>();

            try
            {
                _connection.Open();
                string query = @"
                SELECT questionid, name, category FROM ""Question"" WHERE shared = true;";

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


        [HttpGet("test/{testid}")]
        public ActionResult<IEnumerable<int>> GetQuestionsForTest(int testid)
        {
            List<int> questionIds = new List<int>();

            try
            {
                _connection.Open();
                string query = @"
        SELECT questionid FROM ""QuestionToTest"" WHERE testid = @testid";

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@testid", testid);
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            questionIds.Add(reader.GetInt32(0));
                        }
                    }
                }

                return Ok(questionIds);
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

                    if (request.AddToTest)
                    {
                        string insertQuery = "INSERT INTO \"QuestionToTest\" (testid, questionid) VALUES (@testid, @id) ON CONFLICT DO NOTHING;";
                        using (var insertCommand = new NpgsqlCommand(insertQuery, _connection))
                        {
                            insertCommand.Parameters.AddWithValue("@testid", testid);
                            insertCommand.Parameters.AddWithValue("@id", id);
                            insertCommand.ExecuteNonQuery();
                        }
                    }
                    else
                    {
                        string deleteQuery = "DELETE FROM \"QuestionToTest\" WHERE questionid = @id AND testid = @testid;";
                        using (var deleteCommand = new NpgsqlCommand(deleteQuery, _connection))
                        {
                            deleteCommand.Parameters.AddWithValue("@testid", testid);
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

    public class SharedStatusUpdateRequest
    {
        public bool Shared { get; set; }
        public bool AddToTest { get; set; }
        public int TestId { get; set; }
    }

    public class SharedQuestion
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public bool Shared { get; set; }
    }
}
