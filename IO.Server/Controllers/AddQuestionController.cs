using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public QuestionController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpPost("{testId}")]
        public IActionResult AddQuestionToTest(int testId, [FromBody] Question newQuestion)
        {
            try
            {
                _connection.Open();

                // Wstawienie nowego pytania do tabeli Question
                string insertQuestionQuery = @"
                    INSERT INTO ""Question"" (name, category, questiontype, shared, answer, a, b, c, d, maxpoints)
                    VALUES(@name, @category, @questionType::qtype, @shared, @answer, @a, @b, @c, @d, @maxpoints)
                    RETURNING questionid; ";

                int newQuestionId;
                using (var command = new NpgsqlCommand(insertQuestionQuery, _connection))
                {
                    command.Parameters.AddWithValue("@name", newQuestion.Name);
                    command.Parameters.AddWithValue("@category", newQuestion.Category);
                    command.Parameters.AddWithValue("@questionType", newQuestion.QuestionType);
                    command.Parameters.AddWithValue("@shared", newQuestion.Shared);
                    command.Parameters.AddWithValue("@answer", (object)newQuestion.Answer ?? DBNull.Value);
                    command.Parameters.AddWithValue("@a", (object)newQuestion.A ?? DBNull.Value);
                    command.Parameters.AddWithValue("@b", (object)newQuestion.B ?? DBNull.Value);
                    command.Parameters.AddWithValue("@c", (object)newQuestion.C ?? DBNull.Value);
                    command.Parameters.AddWithValue("@d", (object)newQuestion.D ?? DBNull.Value);
                    command.Parameters.AddWithValue("@maxpoints", (object)newQuestion.MaxPoints ?? DBNull.Value);

                    newQuestionId = Convert.ToInt32(command.ExecuteScalar());
                }

                // Powiązanie pytania z testem w tabeli QuestionToTest
                string insertQuestionToTestQuery = @"
                    INSERT INTO ""QuestionToTest"" (testid, questionid)
                    VALUES(@testId, @questionId); ";

                using (var command = new NpgsqlCommand(insertQuestionToTestQuery, _connection))
                {
                    command.Parameters.AddWithValue("@testId", testId);
                    command.Parameters.AddWithValue("@questionId", newQuestionId);
                    command.ExecuteNonQuery();
                }

                return Ok(new { QuestionId = newQuestionId, Message = "Question added and linked to test successfully." });
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

        [HttpGet("{testId}")]
        public IActionResult GetQuestionsForTest(int testId)
        {
            try
            {
                _connection.Open();

                string query = @"
            SELECT q.questionid, q.name, q.category, q.questiontype, q.shared, 
                   q.answer, q.a, q.b, q.c, q.d, q.maxpoints
            FROM ""Question"" q
            INNER JOIN ""QuestionToTest"" qt ON q.questionid = qt.questionid
            WHERE qt.testid = @testId;";

                var questions = new List<Question>();

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@testId", testId);
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            questions.Add(new Question
                            {
                                Name = reader["name"].ToString(),
                                Category = reader["category"].ToString(),
                                QuestionType = reader["questiontype"].ToString(),
                                Shared = (bool)reader["shared"],
                                Answer = reader["answer"] as string,
                                A = reader["a"] as bool?,
                                B = reader["b"] as bool?,
                                C = reader["c"] as bool?,
                                D = reader["d"] as bool?,
                                MaxPoints = reader["maxpoints"] as int?
                            });
                        }
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


        public class Question
        {
            public string Name { get; set; }
            public string Category { get; set; }
            public string QuestionType { get; set; }
            public bool Shared { get; set; }
            public string Answer { get; set; }
            public bool? A { get; set; }
            public bool? B { get; set; }
            public bool? C { get; set; }
            public bool? D { get; set; }
            public int? MaxPoints { get; set; }
        }
    }
}
