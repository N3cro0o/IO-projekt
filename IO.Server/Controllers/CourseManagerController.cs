using System.Diagnostics;
using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace IO.Server.Controllers
{
    //listowanie kursów
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesManagerController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public CoursesManagerController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpGet("Student/{id}/courses")]
        public ActionResult<IEnumerable<Course>> GetStudentCourses(int id)
        {
            List<Course> courses = new List<Course>();

            try
            {
                _connection.Open();

                // Query to fetch courses
                string query = "SELECT c.courseid, c.name, u.name, u.surname, c.category FROM \"UserToCourse\" uc " +
                    $"JOIN \"Course\" c ON uc.userid = {id} JOIN \"User\" u ON c.ownerid = u.userid WHERE uc.courseid = c.courseid ORDER BY c.name ASC";

                using (var command = new NpgsqlCommand(query, _connection))
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        // Safely retrieve data and handle nullability
                        int courseID = reader.GetInt32(0);
                        string courseName = reader.GetString(1);
                        string userNameF = reader.GetString(2);
                        string userNameL = reader.GetString(3);
                        string cat = reader.GetString(4);
                        userNameF += userNameL;

                        courses.Add(new Course(courseID, courseName, cat, userNameF));
                    }
                }

                return Ok(courses);
            }
            catch (Exception ex)
            {
                Debug.Print(ex.ToString());
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

            return Ok(courses);
        }

        [HttpGet("ListCourse/{userId}")]
        public ActionResult<IEnumerable<Course>> GetCourse(int userId)
        {
            List<Course> courses = new List<Course>();

            try
            {
                _connection.Open();

                // Query to fetch courses
                string query = $"SELECT c.courseid, c.name, c.ownerid, u.name, u.surname, c.category, c.ownerid FROM \"Course\" c " +
                    $"JOIN \"User\" u ON c.ownerid = u.userid WHERE c.ownerid = {userId} ORDER BY c.name ASC";


                using (var command = new NpgsqlCommand(query, _connection))
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        // Safely retrieve data and handle nullability
                        int courseId = reader.GetFieldValue<int>(0);
                        string courseName = reader.GetFieldValue<string>(1);
                        string teachLogin = reader.GetString(3) + " " + reader.GetString(4);
                        string cat = reader.GetString(5);
                        var list = new List<int>([reader.GetInt32(6)]);

                        var courseToReveal = new Course(reader.GetInt32(0), reader.GetString(1), cat, teachLogin);
                        courseToReveal.Teachers = list;
                        courses.Add(courseToReveal);
                    }
                }

                return Ok(courses);
            }
            catch (Exception ex)
            {
                Debug.Print(ex.ToString());
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

        // Dodawanie kursów
        [HttpPost("AddCourse")]
        public ActionResult AddCourse([FromBody] AddCourse course)
        {
            try
            {

                _connection.Open();

                // Insert the new course into the database
                string query = "INSERT INTO \"Course\" (name, category, description, ownerid) VALUES (@name, @category, @description, @ownerid)";

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@name", course.Name);
                    command.Parameters.AddWithValue("@category", course.Category);
                    command.Parameters.AddWithValue("@description", course.Description);
                    command.Parameters.AddWithValue("@ownerid", course.OwnerId);

                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Ok(new { message = "Course created successfully." });
                    }
                    else
                    {
                        return BadRequest(new { message = "Failed to create the course." });
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "An error occurred while creating the course.", details = ex.Message });
            }
            finally
            {
                if (_connection.State == System.Data.ConnectionState.Open)
                {
                    _connection.Close();
                }
            }
        }

        // Usuwanie kursów
        [HttpDelete("DeleteCourse")]
        public IActionResult DeleteCourse([FromBody] DeleteCourseRequest request)
        {
            if (request == null || request.courseid <= 0)
            {
                return BadRequest(new { message = "Invalid course ID." });
            }

            try
            {
                using (var connection = _connection)
                {
                    connection.Open();

                    using (var transaction = connection.BeginTransaction())
                    {
                        try
                        {
                            string deleteTestsQuery = "DELETE FROM \"Test\" WHERE courseid = @courseid";
                            using (var deleteTestsCommand = new NpgsqlCommand(deleteTestsQuery, connection))
                            {
                                deleteTestsCommand.Parameters.AddWithValue("@courseid", request.courseid);
                                deleteTestsCommand.ExecuteNonQuery();
                            }

                            // Usuwanie kursu
                            string deleteCourseQuery = "DELETE FROM \"Course\" WHERE courseid = @courseid";
                            using (var deleteCourseCommand = new NpgsqlCommand(deleteCourseQuery, connection))
                            {
                                deleteCourseCommand.Parameters.AddWithValue("@courseid", request.courseid);
                                int rowsAffected = deleteCourseCommand.ExecuteNonQuery();

                                if (rowsAffected == 0)
                                {
                                    transaction.Rollback();
                                    return NotFound(new { message = "Course not found." });
                                }
                            }

                            transaction.Commit();
                            return Ok(new { message = "Course and associated tests deleted successfully." });
                        }
                        catch (Exception)
                        {
                            transaction.Rollback();
                            throw;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the Course.", details = ex.Message });
            }
        }

        // Lista użytkowników których można dodać do kursu
        [HttpGet("AddUsersList/{courseid}")]
        public ActionResult<IEnumerable<User>> GetUser(int courseid)
        {

            List<User> users = new List<User>();

            try
            {
                _connection.Open();

                string query = $"SELECT u.* FROM \"User\" u LEFT JOIN \"UserToCourse\" utc ON u.userid = utc.userid AND utc.courseid = {courseid} WHERE utc.userid IS NULL;";

                using (var command = new NpgsqlCommand(query, _connection))
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var user = new User
                        (
                            id: reader.GetInt32(0),
                            login: reader.GetString(1),
                            fName: reader.GetString(2),
                            lName: reader.GetString(3),
                            email: reader.GetString(4),
                            passwordHash: reader.GetString(5),
                            role: reader.GetString(6)
                        );
                        users.Add(user);
                    }
                }

                return Ok(users);
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

        // Dodawanie użytkowników do kursu
        [HttpPost("AddUsers")]
        public ActionResult AddUsersToCourse([FromBody] AddUsersRequest request)
        {
            try
            {
                _connection.Open();

                using (var transaction = _connection.BeginTransaction())
                {
                    string query = "INSERT INTO \"UserToCourse\" (courseid, userid) VALUES (@courseid, @userid) ON CONFLICT DO NOTHING;";

                    foreach (var userId in request.UserIds)
                    {
                        using (var command = new NpgsqlCommand(query, _connection))
                        {
                            command.Parameters.AddWithValue("@courseid", request.CourseId);
                            command.Parameters.AddWithValue("@userid", userId);

                            command.ExecuteNonQuery();
                        }
                    }

                    transaction.Commit();
                }

                return Ok("Users successfully added to the course.");
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

        // Wyświetlanie listy użytkowników do usunięcia
        [HttpGet("KickUsersList/{courseid}")]
        public ActionResult<IEnumerable<User>> GetAddedUsers(int courseid)
        {

            List<User> users = new List<User>();

            try
            {
                _connection.Open();

                string query = $"SELECT u.* FROM \"User\" u LEFT JOIN \"UserToCourse\" utc ON utc.courseid = {courseid} WHERE utc.userid IS NOT NULL AND utc.userid = u.userid;";

                using (var command = new NpgsqlCommand(query, _connection))
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var user = new User
                        (
                            id: reader.GetInt32(0),
                            login: reader.GetString(1),
                            fName: reader.GetString(2),
                            lName: reader.GetString(3),
                            email: reader.GetString(4),
                            passwordHash: reader.GetString(5),
                            role: reader.GetString(6)
                        );
                        users.Add(user);
                    }
                }

                return Ok(users);
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

        // Usuwanie użytkowników z kursu
        [HttpPost("KickUsers")]
        public ActionResult RemoveUsersFromCourse([FromBody] ModifyUsersRequest request)
        {
            try
            {
                _connection.Open();

                using (var transaction = _connection.BeginTransaction())
                {
                    string query = "DELETE FROM \"UserToCourse\" WHERE courseid = @courseid AND userid = @userid;";

                    foreach (var userId in request.UserIds)
                    {
                        using (var command = new NpgsqlCommand(query, _connection))
                        {
                            command.Parameters.AddWithValue("@courseid", request.CourseId);
                            command.Parameters.AddWithValue("@userid", userId);

                            command.ExecuteNonQuery();
                        }
                    }

                    transaction.Commit();
                }

                return Ok("Users successfully removed from the course.");
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

// MNIEKURWAPOJEBIE,COTOKURWAJESTAAAAAAAAAAAAAAAAAAAAAAAAA

public class CourseToReveal
{
    public int courseid { get; set; }
    public string courseName { get; set; }
    public int ownerid { get; set; }
    public string ownerLogin { get; set; }
}

public class AddCourse
{
    public string Name { get; set; }
    public string Category { get; set; }
    public string Description { get; set; }
    public int OwnerId { get; set; } // This will be set from the token, not the request body
}

public class DeleteCourseRequest
{
    public int courseid { get; set; }
}

public class AddUsersRequest
{
    public int CourseId { get; set; }
    public List<int> UserIds { get; set; }
}

public class ModifyUsersRequest
{
    public int CourseId { get; set; }
    public List<int> UserIds { get; set; }
}