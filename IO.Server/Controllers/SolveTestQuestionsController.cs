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