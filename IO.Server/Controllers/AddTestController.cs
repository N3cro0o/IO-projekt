using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/test")]
    public class AddTestController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AddTestController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        public IActionResult AddTest([FromBody] Test newTest)
        {
            // Walidacja wejścia
            if (newTest == null)
            {
                return BadRequest("Test data is null.");
            }

            try
            {
                // Pobranie connection string z konfiguracji
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                if (string.IsNullOrEmpty(connectionString))
                {
                    return StatusCode(500, "Database connection string is missing.");
                }

                int newTestId;
                using (var connection = new NpgsqlConnection(connectionString))
                {
                    connection.Open();

                    // Poprawione zapytanie SQL
                    string insertTestQuery = @"
                         INSERT INTO ""Test"" (name, starttime, endtime, category, courseid)
                         VALUES (@name, @startTime, @endTime, @category, @courseId)
                         RETURNING testid";

                    using (var command = new NpgsqlCommand(insertTestQuery, connection))
                    {
                        command.Parameters.AddWithValue("@name", newTest.Name); // character varying
                        command.Parameters.AddWithValue("@startTime", newTest.StartTime); // timestamp
                        command.Parameters.AddWithValue("@endTime", newTest.EndTime);     // timestamp
                        command.Parameters.AddWithValue("@category", newTest.Category);  // character varying
                        command.Parameters.AddWithValue("@courseId", newTest.CourseId);  // integer

                        // Wykonanie zapytania i pobranie ID
                        newTestId = Convert.ToInt32(command.ExecuteScalar());
                    }
                }

                // Zwrócenie sukcesu
                return Ok(new { TestId = newTestId, Message = "Test added successfully." });
            }
            catch (Exception ex)
            {
                // Obsługa błędów
                Console.Error.WriteLine($"Error adding test: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Model danych
        public class Test
        {
            public string Name { get; set; }            // character varying
            public DateTime StartTime { get; set; }     // timestamp without time zone
            public DateTime EndTime { get; set; }       // timestamp without time zone
            public string Category { get; set; }        // character varying
            public int CourseId { get; set; }           // integer
        }
    }
}
