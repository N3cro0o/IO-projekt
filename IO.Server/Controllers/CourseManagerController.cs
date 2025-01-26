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

        [HttpGet("listCourses/{userId}")]
        public ActionResult<IEnumerable<CourseToReveal>> GetCourse(int userId)
        {
            List<CourseToReveal> courses = new List<CourseToReveal>();

            try
            {
                _connection.Open();

                // Query to fetch courses
                string query = $"SELECT c.courseid, c.name, c.ownerid, u.login FROM \"Course\" c JOIN \"User\" u ON c.ownerid = u.userid WHERE c.ownerid = {userId} ORDER BY c.name ASC";


                using (var command = new NpgsqlCommand(query, _connection))
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        // Safely retrieve data and handle nullability
                        int courseId = reader.GetFieldValue<int>(0);
                        string courseName = reader.GetFieldValue<string>(1);
                        int ownerId = reader.GetFieldValue<int>(2);
                        string ownerLogin = reader.GetString(3);

                        var courseToReveal = new CourseToReveal
                        {
                            courseid = courseId,
                            courseName = courseName,
                            ownerid = ownerId,
                            ownerLogin = ownerLogin
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
        public string ownerLogin { get; set; }
    }
}