using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesManagerController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public CoursesManagerController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpGet("listCourses")]
        public ActionResult<IEnumerable<CourseToReveal>> GetCourse()
        {
            List<CourseToReveal> courses = new List<CourseToReveal>();

            try
            {
                _connection.Open();

                // Query to fetch courses
                string query = "SELECT courseid, name, ownerid FROM \"Course\" ORDER BY name ASC";

                using (var command = new NpgsqlCommand(query, _connection))
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        // Safely retrieve data and handle nullability
                        int courseId = reader.GetFieldValue<int>(0);
                        string courseName = reader.GetFieldValue<string>(1);
                        int ownerId = reader.GetFieldValue<int>(2);

                        var courseToReveal = new CourseToReveal
                        {
                            courseid = courseId,
                            courseName = courseName,
                            ownerid = ownerId
                        };

                        courses.Add(courseToReveal);
                    }
                }

                return Ok(courses);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "An error occurred while fetching courses.", details = ex.Message });
            }
            finally
            {
                // Ensure the connection is closed
                if (_connection.State == System.Data.ConnectionState.Open)
                {
                    _connection.Close();
                }
            }
        }
    }

    public class CourseToReveal
    {
        public int courseid { get; set; }
        public string courseName { get; set; }
        public int ownerid { get; set; }
    }
}