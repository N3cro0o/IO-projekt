using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AddQuestionController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public AddQuestionController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpPost("{testId}")]
        public IActionResult AddQuestionToTest(int testId, [FromBody] Question newQuestion)
        {
            try
            {
                _connection.Open();

                // 1. Dodanie nowego pytania do tabeli Question
                string insertQuestionQuery = @"
    INSERT INTO ""Question"" (name, category, questiontype, shared)
    VALUES (@name, @category, @questionType::qtype, @shared)
    RETURNING questionid";


                int newQuestionId;
                using (var command = new NpgsqlCommand(insertQuestionQuery, _connection))
                {
                    command.Parameters.AddWithValue("@name", newQuestion.Name);
                    command.Parameters.AddWithValue("@category", newQuestion.Category);
                    command.Parameters.AddWithValue("@questionType", newQuestion.QuestionType);
                    command.Parameters.AddWithValue("@shared", newQuestion.Shared);

                    newQuestionId = Convert.ToInt32(command.ExecuteScalar());
                }

                // 2. Powiązanie nowego pytania z testem w tabeli QuestionToTest
                string insertQuestionToTestQuery = @"
            INSERT INTO ""QuestionToTest"" (testid, questionid)
            VALUES (@testId, @questionId)";

                using (var command = new NpgsqlCommand(insertQuestionToTestQuery, _connection))
                {
                    command.Parameters.AddWithValue("@testId", testId);
                    command.Parameters.AddWithValue("@questionId", newQuestionId);
                    command.ExecuteNonQuery();
                }

                // Zwracamy informację o powodzeniu operacji
                return Ok(new { QuestionId = newQuestionId, Message = "Question added successfully." });
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

        // Klasa modelu pytania
        public class Question
        {
            public string Name { get; set; }
            public string Category { get; set; }
            public string QuestionType { get; set; }
            public bool Shared { get; set; }
        }

    }
}
