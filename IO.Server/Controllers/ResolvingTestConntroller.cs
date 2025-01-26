using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System.Collections.Generic;
using System;

using static System.Net.Mime.MediaTypeNames;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResolvingTestConntroller : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public ResolvingTestConntroller(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpGet("getQuestions/{testId}")]
        public ActionResult<IEnumerable<QuestionToReveal>> GetTestQuestions(int testId)
        {
            List<QuestionToReveal> questions = new List<QuestionToReveal>();

            try
            {
                _connection.Open();

                // Query to fetch questions for the specified test
                string query = $"SELECT q.questionid, q.text, q.type FROM \"Question\" q WHERE q.testid = {testId} ORDER BY q.questionid ASC";

                using (var command = new NpgsqlCommand(query, _connection))
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        int questionId = reader.GetFieldValue<int>(0);
                        string questionText = reader.GetFieldValue<string>(1);
                        string questionType = reader.GetFieldValue<string>(2);

                        var questionToReveal = new QuestionToReveal
                        {
                            questionId = questionId,
                            questionText = questionText,
                            questionType = questionType
                        };

                        questions.Add(questionToReveal);
                    }
                }

                return Ok(questions);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "An error occurred while fetching questions.", details = ex.Message });
            }
            finally
            {
                if (_connection.State == System.Data.ConnectionState.Open)
                {
                    _connection.Close();
                }
            }
        }

        [HttpPost("submitAnswer/{testId}/{questionId}")]
        public ActionResult SubmitAnswer(int testId, int questionId, [FromBody] string answer)
        {
            try
            {
                _connection.Open();

                // Save answer to the database (e.g., in an Answers table)
                string query = $"INSERT INTO \"Answers\" (testid, questionid, answertext) VALUES (@testId, @questionId, @answer)";

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@testId", testId);
                    command.Parameters.AddWithValue("@questionId", questionId);
                    command.Parameters.AddWithValue("@answer", answer);
                    command.ExecuteNonQuery();
                }

                return Ok(new { message = "Answer submitted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "An error occurred while submitting the answer.", details = ex.Message });
            }
            finally
            {
                if (_connection.State == System.Data.ConnectionState.Open)
                {
                    _connection.Close();
                }
            }
        }
    }

    public class QuestionToReveal
    {
        public int questionId { get; set; }
        public string questionText { get; set; }
        public string questionType { get; set; } // For example: "open" or "multiple-choice"
    }
}
