using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeleteQuestionController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public DeleteQuestionController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpDelete("{testId}/{questionId}")]
        public IActionResult DeleteQuestionFromTest(int testId, int questionId)
        {
            try
            {
                _connection.Open();

                // 1. Usunięcie powiązania pytania z testem w tabeli QuestionToTest
                string deleteQuestionFromTestQuery = @"
                DELETE FROM ""QuestionToTest"" 
                WHERE testid = @testId AND questionid = @questionId";

                using (var command = new NpgsqlCommand(deleteQuestionFromTestQuery, _connection))
                {
                    command.Parameters.AddWithValue("@testId", testId);
                    command.Parameters.AddWithValue("@questionId", questionId);
                    command.ExecuteNonQuery();
                }

                // 2. Usunięcie pytania z tabeli Question
                string deleteQuestionQuery = @"
                DELETE FROM ""Question"" 
                WHERE questionid = @questionId";

                using (var command = new NpgsqlCommand(deleteQuestionQuery, _connection))
                {
                    command.Parameters.AddWithValue("@questionId", questionId);
                    command.ExecuteNonQuery();
                }

                return Ok(new { Message = "Question deleted successfully." });
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
}