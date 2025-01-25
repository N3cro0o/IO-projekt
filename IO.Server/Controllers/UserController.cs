using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public UserController(NpgsqlConnection connection)
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
    }
}
