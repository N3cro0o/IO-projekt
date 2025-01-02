using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System.Collections.Generic;
using IO.Server.Elements;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourseController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public CourseController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpGet("list")]
        public ActionResult<IEnumerable<Course>> GetCourses()
        {
            List<Course> courses = new List<Course>();

            try
            {
                _connection.Open();

                // SQL query to fetch courses
                string query = "SELECT courseid, name, category, description, ownerid FROM \"Course\" ORDER BY courseid ASC";

                using (var command = new NpgsqlCommand(query, _connection))
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        // Reading course details
                        var course = new Course
                        (
                            id: reader.GetInt32(0),       // courseid
                            name: reader.GetString(1),    // name
                            cat: reader.GetString(2),     // category as string
                            teachers: new List<int>(),    // Populate from database if needed
                            students: new List<int>(),    // Populate from database if needed
                            tests: new List<int>()        // Populate from database if needed
                        );
                        courses.Add(course);
                    }
                }

                return Ok(courses); // Return the list of courses
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
    }
}
