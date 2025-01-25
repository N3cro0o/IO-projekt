using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
//sprawdzic ze czas nie moze byc null bo wywala strone. 
namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SetTestTimeController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public SetTestTimeController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpPut("{testId}")]
        public ActionResult UpdateTestTime(int testId, [FromBody] TestTimeUpdateRequest request)
        {
            try
            {
                // Walidacja: czas rozpoczęcia i zakończenia
                if (request.StartTime < DateTime.UtcNow)
                {
                    return BadRequest("Start time cannot be in the past.");
                }

                if (request.EndTime <= request.StartTime)
                {
                    return BadRequest("End time must be later than start time.");
                }

                _connection.Open();

                const string query = @"
        UPDATE ""Test""
        SET starttime = @StartTime, endtime = @EndTime
        WHERE testid = @TestId";

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@TestId", testId);
                    command.Parameters.AddWithValue("@StartTime", request.StartTime);
                    command.Parameters.AddWithValue("@EndTime", request.EndTime);

                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return NotFound($"No test found with ID {testId}.");
                    }
                }

                Console.WriteLine($"Test time for ID {testId} was successfully updated.");
                return Ok($"Test time for ID {testId} has been updated.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error while updating test time: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                _connection.Close();
            }
        }

    }

    public class TestTimeUpdateRequest
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}