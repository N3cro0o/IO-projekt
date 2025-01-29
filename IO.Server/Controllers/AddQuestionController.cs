using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Collections.Generic;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        // Constructor: Initializes the controller with a PostgreSQL connection
        public QuestionController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        // Endpoint: Add a question to a specific test
        [HttpPost("{testId}")]
        public IActionResult AddQuestionToTest(int testId, [FromBody] Question newQuestion)
        {
            try
            {
                _connection.Open();

                // Insert the question into the "Question" table
                string insertQuestionQuery = @"
        INSERT INTO ""Question"" (name, category, questiontype, shared, answer, a, b, c, d, maxpoints)
        VALUES(@name, @category, @questionType::qtype, @shared, @answer, @a, @b, @c, @d, @maxpoints)
        RETURNING questionid;";

                int newQuestionId;
                using (var command = new NpgsqlCommand(insertQuestionQuery, _connection))
                {
                    command.Parameters.AddWithValue("@name", newQuestion.Name);
                    command.Parameters.AddWithValue("@category", newQuestion.Category);
                    command.Parameters.AddWithValue("@questionType", newQuestion.QuestionType);
                    command.Parameters.AddWithValue("@shared", newQuestion.Shared);
                    command.Parameters.AddWithValue("@answer", (object)newQuestion.Answer ?? DBNull.Value);
                    command.Parameters.AddWithValue("@a", newQuestion.A ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@b", newQuestion.B ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c", newQuestion.C ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@d", newQuestion.D ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@maxpoints", (object)newQuestion.MaxPoints ?? DBNull.Value);

                    newQuestionId = Convert.ToInt32(command.ExecuteScalar());
                }

                // Link the new question to the specified test in "QuestionToTest"
                string insertQuestionToTestQuery = @"
        INSERT INTO ""QuestionToTest"" (testid, questionid)
        VALUES(@testId, @questionId);";

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


        // Endpoint: Get all questions linked to a specific test
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
                                A = reader["a"] is DBNull ? null : (bool?)reader["a"],
                                B = reader["b"] is DBNull ? null : (bool?)reader["b"],
                                C = reader["c"] is DBNull ? null : (bool?)reader["c"],
                                D = reader["d"] is DBNull ? null : (bool?)reader["d"],
                                MaxPoints = reader["maxpoints"] is DBNull ? null : (int?)reader["maxpoints"]
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


        // Data model: Represents a question
        public class Question
        {
            public string Name { get; set; }            // Question text
            public string Category { get; set; }       // Question category
            public string QuestionType { get; set; }   // Type: "open" or "closed"
            public bool Shared { get; set; }           // Shared status
            public string Answer { get; set; }         // Answer for open-ended questions
            public bool? A { get; set; }               // Option A (true for correct)
            public bool? B { get; set; }               // Option B (true for correct)
            public bool? C { get; set; }               // Option C (true for correct)
            public bool? D { get; set; }               // Option D (true for correct)
            public int? MaxPoints { get; set; }        // Maximum points for the question
        }
    }
}
