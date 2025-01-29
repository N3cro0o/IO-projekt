using System.Diagnostics;
using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Npgsql;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestManagerController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public TestManagerController(NpgsqlConnection connection)
        {
            _connection = connection;
        }


        [HttpPost("answer/add/test")]
        public ActionResult AddAnswerToDB([FromBody] Answer answ)
        {
            try
            {
                int a = (answ.Key & 1 << 3) >> 3;
                int b = (answ.Key & 1 << 2) >> 2;
                int c = (answ.Key & 1 << 1) >> 1;
                int d = (answ.Key & 1 << 0) >> 0;
                _connection.Open();
                string query = "INSERT INTO \"Answer\" (points, answer, a, b, c, d, questionid, testid) VALUES " +
                    $"('{answ.Points.ToString(System.Globalization.CultureInfo.InvariantCulture)}','{answ.Text}','{a}','{b}','{c}','{d}','{answ.Question}','{answ.Test}')";
                var com = new NpgsqlCommand(query, _connection);
                com.ExecuteNonQuery();
                _connection.Close();
            }
            catch (Exception ex) 
            {
                Debug.Print(ex.ToString());
                return BadRequest(ex.Message);
            }
            return Ok();
        }

        // Wyświetlanie Testów
        [HttpGet("TestsList/{courseId}/tests")]
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

        // Dodawanie Testów do kursu
        [HttpPost("AddTest")]
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

        // Usuwanie Testów
        [HttpDelete("DeleteTest/{testId}")]
        public ActionResult DeleteTest(int testId)
        {
            try
            {
                _connection.Open();

                const string query = @"DELETE FROM ""Test"" WHERE testid = @TestId";

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@TestId", testId);

                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return NotFound($"No test found with ID {testId}.");
                    }
                }

                Console.WriteLine($"Test with ID {testId} was successfully deleted.");
                return Ok($"Test with ID {testId} has been deleted.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error while deleting test: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                _connection.Close();
            }
        }

        // Ustawianie czasu Testów
        [HttpPut("SetTestTime/{testId}")]
        public ActionResult UpdateTestTime(int testId, [FromBody] TestTimeUpdateRequest request)
        {
            try
            {
                // Walidacja: czas rozpoczęcia i zakończenia
                if (request.StartTime < DateTime.UtcNow)
                {
                    return BadRequest("Start time cannot be in the past.");
                }

                if (request.EndTime <= request.StartTime)
                {
                    return BadRequest("End time must be later than start time.");
                }

                _connection.Open();

                const string query = @"
        UPDATE ""Test""
        SET starttime = @StartTime, endtime = @EndTime
        WHERE testid = @TestId";

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@TestId", testId);
                    command.Parameters.AddWithValue("@StartTime", request.StartTime);
                    command.Parameters.AddWithValue("@EndTime", request.EndTime);

                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return NotFound($"No test found with ID {testId}.");
                    }
                }

                Console.WriteLine($"Test time for ID {testId} was successfully updated.");
                return Ok($"Test time for ID {testId} has been updated.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error while updating test time: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                _connection.Close();
            }
        }

        //  Uruchamianie Testu w czasie rzeczywistym
        [HttpPut("StartTest/{testId}")]
        public ActionResult StartTest(int testId)
        {
            try
            {
                _connection.Open();

                DateTime startTime = DateTime.UtcNow;
                DateTime endTime = startTime.AddHours(2);

                const string query = @"
                UPDATE ""Test""
                SET starttime = @StartTime, endtime = @EndTime
                WHERE testid = @TestId";

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@TestId", testId);
                    command.Parameters.AddWithValue("@StartTime", startTime);
                    command.Parameters.AddWithValue("@EndTime", endTime);

                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return NotFound($"No test found with ID {testId}.");
                    }
                }

                Console.WriteLine($"Test with ID {testId} successfully started.");
                return Ok($"Test with ID {testId} has been started.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error while starting test: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                _connection.Close();
            }
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

public class Test
{
    public int TestId { get; set; } // Poprawiona nazwa na bardziej zgodną z kodem
    public string Name { get; set; }
    public DateTime? StartTime { get; set; } // Poprawna nazwa i typ
    public DateTime? EndTime { get; set; } // Poprawna nazwa i typ
    public string Category { get; set; }
    public int CourseId { get; set; }
}

public class TestTimeUpdateRequest
{
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
}

