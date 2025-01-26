using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourseUsersController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public CourseUsersController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpGet("list/{courseid}")]
        public ActionResult<IEnumerable<User>> GetUser(int courseid)
        {

            List<User> users = new List<User>();

            try
            {
                _connection.Open();

                //id kursu do poprawy trzeba przesłać
                //poprawic pobierane dane
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
        [HttpPost("kickUsers")]
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

    public class ModifyUsersRequest
    {
        public int CourseId { get; set; }
        public List<int> UserIds { get; set; }
    }
}
