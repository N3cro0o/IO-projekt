using Microsoft.AspNetCore.Mvc;
using Npgsql;

using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/ShareQuestion")]
[ApiController]
public class ShareQuestionController : ControllerBase
{
    private readonly NpgsqlConnection _connection;

    public ShareQuestionController(NpgsqlConnection connection)
    {
        _connection = connection;
    }

    public class ShareUpdateModel
    {
        public int Id { get; set; }
        public bool Shared { get; set; }
    }

    [HttpPut("UpdateSharedStatus")]
    public async Task<IActionResult> UpdateSharedStatus([FromBody] List<ShareUpdateModel> updates)
    {
        try
        {
            // Logowanie danych przychodzących z front-endu
            Console.WriteLine("Received updates: ");
            foreach (var update in updates)
            {
                Console.WriteLine($"ID: {update.Id}, Shared: {update.Shared}");
            }

            await _connection.OpenAsync();

            foreach (var update in updates)
            {
                const string query = @"UPDATE ""Question"" SET shared = @Shared WHERE id = @Id";
                using var command = new NpgsqlCommand(query, _connection);
                command.Parameters.AddWithValue("@Id", update.Id);
                command.Parameters.AddWithValue("@Shared", update.Shared);
                await command.ExecuteNonQueryAsync();
            }

            return Ok("Shared status updated successfully.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
        finally
        {
            await _connection.CloseAsync();
        }
    }
}