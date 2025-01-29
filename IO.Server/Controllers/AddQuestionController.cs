using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using IO.Server.Elements;
using System.Diagnostics;

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
                    command.Parameters.AddWithValue("@answer", (object)newQuestion.Answers ?? DBNull.Value);
                    command.Parameters.AddWithValue("@a", (object)newQuestion.ReturnCorrectAnswerSingle(Question.QUESTION_ANSWER.A) ?? DBNull.Value);
                    command.Parameters.AddWithValue("@b", (object)newQuestion.ReturnCorrectAnswerSingle(Question.QUESTION_ANSWER.B) ?? DBNull.Value);
                    command.Parameters.AddWithValue("@c", (object)newQuestion.ReturnCorrectAnswerSingle(Question.QUESTION_ANSWER.C) ?? DBNull.Value);
                    command.Parameters.AddWithValue("@d", (object)newQuestion.ReturnCorrectAnswerSingle(Question.QUESTION_ANSWER.D) ?? DBNull.Value);
                    command.Parameters.AddWithValue("@maxpoints", (object)newQuestion.Points ?? DBNull.Value);

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
                Debug.Print(ex.ToString());
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                _connection.Close();
            }
        }

        [HttpGet("questions/from/{testID}")]
        public IActionResult GetQuestionsForTest(int testID)
        {
            try
            {
                _connection.Open();

                string query = @"
            SELECT q.* FROM ""Question"" q
            INNER JOIN ""QuestionToTest"" qt ON q.questionid = qt.questionid
            WHERE qt.testid = @testId;";

                var questions = new List<Question>();

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@testId", testID);
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            int id = reader.GetInt32(0);
                            string name = reader.GetString(1);
                            string cat = reader.GetString(2);
                            string questionType = reader.GetString(3);
                            bool shared = reader.GetBoolean(4);
                            double points = reader.GetDouble(10);
                            string text = reader.GetString(11);
                            bool a = reader.GetBoolean(6);
                            bool b = reader.GetBoolean(7);
                            bool c = reader.GetBoolean(8);
                            bool d = reader.GetBoolean(9);
                            int key = (d ? 1 : 0) + (c ? 2 : 0) + (b ? 4 : 0) + (a ? 8 : 0);
                            var q = new Question(name, text, questionType, reader.GetString(5), points, key, cat, shared, id);
                            questions.Add(q);
                        }
                    }
                }

                return Ok(questions);
            }
            catch (Exception ex)
            {
                Debug.Print(ex.ToString());
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                _connection.Close();
            }
        }
    }
}
