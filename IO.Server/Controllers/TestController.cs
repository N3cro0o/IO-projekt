using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Collections.Generic;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/test")]
    public class TestController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public TestController()
        {
            _connection = new NpgsqlConnection("Host=localhost;Database=TesatyWiezy;Username=postgres;Password=yourpassword");
        }

        [HttpGet("{courseId}/{testId}/users")]
        public ActionResult<IEnumerable<User>> GetUsersForTest(int courseId, int testId)
        {
            var users = new List<User>();

            try
            {
                _connection.Open();

                const string query = @"
        SELECT DISTINCT u.userid, u.name, u.surname, u.email
        FROM ""User"" u
        INNER JOIN ""Results"" r ON r.userid = u.userid
        INNER JOIN ""UserToCourse"" utc ON utc.userid = u.userid
        WHERE r.testid = @TestId AND utc.courseid = @CourseId";

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@TestId", testId);
                    command.Parameters.AddWithValue("@CourseId", courseId);

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var user = new User
                            {
                                UserId = reader.GetInt32(0),
                                Name = reader.GetString(1),
                                Surname = reader.GetString(2),
                                Email = reader.GetString(3)
                            };

                            users.Add(user);
                        }
                    }
                }

                if (users.Count == 0)
                {
                    return NotFound("No users found for the specified test and course.");
                }

                return Ok(users);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                _connection.Close();
            }
        }


    }

    public class User
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
    }
}
