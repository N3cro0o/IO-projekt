using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StartTestController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public StartTestController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpPut("{testId}")]
        public ActionResult StartTest(int testId)
        {
            try
            {
                _connection.Open();

                DateTime startTime = DateTime.UtcNow;
                DateTime endTime = startTime.AddHours(2);

                const string query = @"
                UPDATE ""Test""
                SET starttime = @StartTime, endtime = @EndTime
                WHERE testid = @TestId";

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@TestId", testId);
                    command.Parameters.AddWithValue("@StartTime", startTime);
                    command.Parameters.AddWithValue("@EndTime", endTime);

                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return NotFound($"No test found with ID {testId}.");
                    }
                }

                Console.WriteLine($"Test with ID {testId} successfully started.");
                return Ok($"Test with ID {testId} has been started.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error while starting test: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                _connection.Close();
            }
        }
    }
}
