using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AddTestController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public AddTestController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpPost]
        public ActionResult AddTest([FromBody] TestModel newTest)
        {
            try
            {
                _connection.Open();

                const string query = @"
                INSERT INTO ""Test"" (name, category, courseid, starttime, endtime)
                VALUES (@Name, @Category, @CourseId, @StartTime, @EndTime)
                RETURNING testid, name, category, courseid, starttime, endtime";

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@Name", newTest.Name);
                    command.Parameters.AddWithValue("@Category", newTest.Category);
                    command.Parameters.AddWithValue("@CourseId", newTest.CourseId);
                    command.Parameters.AddWithValue("@StartTime", newTest.StartTime);
                    command.Parameters.AddWithValue("@EndTime", newTest.EndTime);

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var addedTest = new
                            {
                                TestId = reader.GetInt32(0),
                                Name = reader.GetString(1),
                                Category = reader.GetString(2),
                                CourseId = reader.GetInt32(3),
                                StartTime = reader.GetDateTime(4),
                                EndTime = reader.GetDateTime(5),
                            };

                            return Ok(addedTest);
                        }
                        else
                        {
                            return BadRequest("Failed to add test.");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error while adding test: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                _connection.Close();
            }
        }
    }

    public class TestModel
    {
        public string Name { get; set; }
        public string Category { get; set; }
        public int CourseId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}