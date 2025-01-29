using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Collections.Generic;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShareQuestionController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public ShareQuestionController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpPut("UpdateSharedStatus")]
        public IActionResult UpdateSharedStatus([FromBody] List<SharedUpdateRequest> updates)
        {
            if (updates == null || updates.Count == 0)
            {
                return BadRequest("No updates provided.");
            }

            try
            {
                _connection.Open();

                foreach (var update in updates)
                {
                    string updateQuery = @"
                        UPDATE ""Question""
                        SET shared = @shared
                        WHERE name = @name;
                    ";

                    using (var command = new NpgsqlCommand(updateQuery, _connection))
                    {
                        command.Parameters.AddWithValue("@shared", update.Shared);
                        command.Parameters.AddWithValue("@name", update.Name);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            return NotFound($"No question found with name '{update.Name}'.");
                        }
                    }
                }

                return Ok(new { Message = "Shared status updated successfully for selected questions." });
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

        public class SharedUpdateRequest
        {
            public string Name { get; set; }
            public bool Shared { get; set; }
        }
    }
}
