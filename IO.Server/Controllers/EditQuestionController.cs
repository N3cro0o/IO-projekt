using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EditQuestionController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public EditQuestionController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpPut("{questionId}")]
        public IActionResult EditQuestion(int questionId, [FromBody] Question updatedQuestion)
        {
            try
            {
                _connection.Open();

                // Sprawdzamy, czy pytanie istnieje
                string checkQuery = @"SELECT COUNT(*) FROM ""Question"" WHERE questionid = @questionId";
                using (var checkCommand = new NpgsqlCommand(checkQuery, _connection))
                {
                    checkCommand.Parameters.AddWithValue("@questionId", questionId);
                    int count = Convert.ToInt32(checkCommand.ExecuteScalar());

                    if (count == 0)
                    {
                        return NotFound("Question not found.");
                    }
                }

                // Aktualizacja danych pytania
                string updateQuery = @"
                    UPDATE ""Question"" 
                    SET name = @name, 
                        category = @category, 
                        questiontype = @questionType::qtype, 
                        shared = @shared 
                    WHERE questionid = @questionId";

                using (var updateCommand = new NpgsqlCommand(updateQuery, _connection))
                {
                    updateCommand.Parameters.AddWithValue("@name", updatedQuestion.Name);
                    updateCommand.Parameters.AddWithValue("@category", updatedQuestion.Category);
                    updateCommand.Parameters.AddWithValue("@questionType", updatedQuestion.QuestionType);
                    updateCommand.Parameters.AddWithValue("@shared", updatedQuestion.Shared);
                    updateCommand.Parameters.AddWithValue("@questionId", questionId);

                    int rowsAffected = updateCommand.ExecuteNonQuery();
                    if (rowsAffected == 0)
                    {
                        return NotFound("Failed to update question.");
                    }
                }

                return Ok(new { QuestionId = questionId, Message = "Question updated successfully." });
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
