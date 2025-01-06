using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

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
                Console.WriteLine("Połączenie z bazą danych otwarte.");

                string query = "SELECT courseid, name, category, description, ownerid FROM \"Course\" ORDER BY courseid ASC";

                using (var command = new NpgsqlCommand(query, _connection))
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Console.WriteLine($"Wczytywanie kursu: ID={reader.GetInt32(0)}, Name={reader.GetString(1)}");

                        var course = new Course(
                            id: reader.GetInt32(0),          // courseid
                            name: reader.GetString(1),       // name
                            cat: reader.GetString(2),        // category
                            teachers: new List<int>(),       // Wypełnij nauczycielami, jeśli wymagane
                            students: new List<int>(),       // Wypełnij studentami, jeśli wymagane
                            tests: new List<int>()           // Wypełnij testami, jeśli wymagane
                        );
                        courses.Add(course);
                    }
                }

                Console.WriteLine($"Łączna liczba kursów: {courses.Count}");
                return Ok(courses);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Błąd: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                _connection.Close();
                Console.WriteLine("Połączenie z bazą danych zamknięte.");
            }
        }

    }
}

