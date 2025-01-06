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



    }

    public class Test
    {
        public int TestId { get; set; } // Poprawiona nazwa na bardziej zgodną z kodem
        public string Name { get; set; }
        public DateTime? StartTime { get; set; } // Poprawna nazwa i typ
        public DateTime? EndTime { get; set; } // Poprawna nazwa i typ
        public string Category { get; set; }
        public int CourseId { get; set; }
    }
}