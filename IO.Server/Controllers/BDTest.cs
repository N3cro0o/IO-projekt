using Microsoft.AspNetCore.Mvc;
using Npgsql;

[ApiController]
[Route("api/[controller]")]
public class TestDatabaseController : ControllerBase
{
    private readonly NpgsqlConnection _connection;

    public TestDatabaseController(NpgsqlConnection connection)
    {
        _connection = connection;
    }

    [HttpGet("test-connection")]
    public IActionResult TestConnection()
    {
        try
        {
            _connection.Open();

            using (var command = new NpgsqlCommand("SELECT NOW()", _connection))
            {
                var result = command.ExecuteScalar();
                return Ok($"Połączenie z bazą danych działa! Czas na serwerze bazy: {result}");
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Błąd podczas łączenia z bazą danych: {ex.Message}");
        }
        finally
        {
            if (_connection.State == System.Data.ConnectionState.Open)
            {
                _connection.Close();
            }
        }
    }
}