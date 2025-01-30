using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArchiveTestController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public ArchiveTestController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpPut("ArchiveTest/{testId}")]
        public async Task<IActionResult> ArchiveTest(int testId, [FromBody] ArchiveTestRequest request)
        {
            if (_connection.State != System.Data.ConnectionState.Open)
            {
                await _connection.OpenAsync();
            }

            try
            {
                string query = "UPDATE \"Test\" SET archived = @archived WHERE testid = @testid";

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@archived", request.Archived);
                    command.Parameters.AddWithValue("@testid", testId);

                    int rowsAffected = await command.ExecuteNonQueryAsync();

                    if (rowsAffected > 0)
                    {
                        return Ok(new { Message = $"Test {(request.Archived ? "archived" : "unarchived")} successfully!" });
                    }
                    else
                    {
                        return NotFound(new { Message = "Test not found!" });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while archiving the test.", Error = ex.Message });
            }
            finally
            {
                await _connection.CloseAsync();
            }
        }
    }

    // Klasa ArchiveTestRequest wewnątrz tej samej przestrzeni nazw
    public class ArchiveTestRequest
    {
        public bool Archived { get; set; }
    }
}

