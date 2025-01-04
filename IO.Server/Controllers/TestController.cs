using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Collections.Generic;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public TestController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        // Pobieranie testów na podstawie ID kursu
        [HttpGet("{courseId}/tests")]
        public ActionResult<IEnumerable<Test>> GetTestsByCourseId(int courseId)
        {
            var tests = new List<Test>();

            try
            {
                _connection.Open();

                const string query = @"
            SELECT testid, name, starttime, endtime, category, courseid 
            FROM ""Test"" 
            WHERE courseid = @CourseId";

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@CourseId", courseId);

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var test = new Test
                            {
                                TestId = reader.GetInt32(0),
                                Name = reader.GetString(1),
                                StartTime = reader.GetDateTime(2),
                                EndTime = reader.GetDateTime(3),
                                Category = reader.GetString(4),
                                CourseId = reader.GetInt32(5)
                            };

                            tests.Add(test);
                            Console.WriteLine($"Test wczytany: ID={test.TestId}, Name={test.Name}, CourseID={test.CourseId}");
                        }
                    }
                }

                Console.WriteLine($"Łączna liczba testów dla kursu {courseId}: {tests.Count}");

                if (tests.Count == 0)
                {
                    return NotFound("No tests found for the specified course ID.");
                }

                return Ok(tests);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Błąd: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                _connection.Close();
            }
        }

        // Usuwanie testu na podstawie jego ID
        [HttpDelete("{testId}")]
        public IActionResult DeleteTest(int testId)
        {
            try
            {
                _connection.Open();

                const string query = @"
            DELETE FROM ""Test""
            WHERE testid = @TestId";

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@TestId", testId);
                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return NotFound(new { message = "Test not found or already deleted." });
                    }

                    Console.WriteLine($"Usunięto test o ID={testId}");
                    return Ok(new { message = "Test successfully deleted." });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Błąd: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                _connection.Close();
            }
        }

        // Klasa reprezentująca test
        public class Test
        {
            public int TestId { get; set; } // ID testu
            public string Name { get; set; } // Nazwa testu
            public DateTime StartTime { get; set; } // Data rozpoczęcia testu
            public DateTime EndTime { get; set; } // Data zakończenia testu
            public string Category { get; set; } // Kategoria testu
            public int CourseId { get; set; } // ID kursu
        }
    }
}
