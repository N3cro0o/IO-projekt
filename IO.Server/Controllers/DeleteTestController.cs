using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeleteTestController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public DeleteTestController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpDelete("{testId}")]
        public ActionResult DeleteTest(int testId)
        {
            try
            {
                _connection.Open();

                const string query = @"DELETE FROM ""Test"" WHERE testid = @TestId";

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@TestId", testId);

                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return NotFound($"No test found with ID {testId}.");
                    }
                }

                Console.WriteLine($"Test with ID {testId} was successfully deleted.");
                return Ok($"Test with ID {testId} has been deleted.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error while deleting test: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                _connection.Close();
            }
        }
    }
}