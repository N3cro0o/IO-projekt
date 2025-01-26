using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using static System.Net.Mime.MediaTypeNames;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestsManagerController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public TestsManagerController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpGet("listTests/{userId}")]
        public ActionResult<IEnumerable<TestToReveal>> GetUserTests(int userId)
        {
            List<TestToReveal> tests = new List<TestToReveal>();

            try
            {
                _connection.Open();

                // Query to fetch tests assigned to the user
                string query = $@"
            SELECT t.testid, 
                   t.name AS test_name, 
                   t.courseid, 
                   c.name AS course_name
            FROM \""Tests\"" t
                    JOIN \""UserToCourse\"" utc ON t.courseid = utc.courseid
                    JOIN \""Course\"" c ON c.courseid = t.courseid
                    WHERE utc.userid = { userId}
                ORDER BY t.name ASC";
        
        using (var command = new NpgsqlCommand(query, _connection))
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        int testId = reader.GetFieldValue<int>(0);
                        string testName = reader.GetFieldValue<string>(1);
                        
                        int courseId = reader.GetFieldValue<int>(3);
                        string courseName = reader.GetFieldValue<string>(4);

                        var testToReveal = new TestToReveal
                        {
                            testId = testId,
                            testName = testName,
                           
                            courseId = courseId,
                            courseName = courseName
                        };

                        tests.Add(testToReveal);
                    }
                }

                return Ok(tests);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "An error occurred while fetching tests.", details = ex.Message });
            }
            finally
            {
                if (_connection.State == System.Data.ConnectionState.Open)
                {
                    _connection.Close();
                }
            }
        }

        [HttpGet("getQuestions/{testId}")]
        public ActionResult<IEnumerable<QuestionToReveal>> GetTestQuestions(int testId)
        {
            List<QuestionToReveal> questions = new List<QuestionToReveal>();

            try
            {
                _connection.Open();

                // Query to fetch questions for the specified test
                string query = $"SELECT q.questionid, q.text, q.type FROM \"Question\" q WHERE q.testid = {testId} ORDER BY q.questionid ASC";

                using (var command = new NpgsqlCommand(query, _connection))
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        int questionId = reader.GetFieldValue<int>(0);
                        string questionText = reader.GetFieldValue<string>(1);
                        string questionType = reader.GetFieldValue<string>(2);

                        var questionToReveal = new QuestionToReveal
                        {
                            questionId = questionId,
                            questionText = questionText,
                            questionType = questionType
                        };

                        questions.Add(questionToReveal);
                    }
                }

                return Ok(questions);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "An error occurred while fetching questions.", details = ex.Message });
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

    public class TestToReveal
    {
        public int testId { get; set; }
        public string testName { get; set; }
        public int courseId { get; set; }
        public string courseName { get; set; }
    }

    public class QuestionToReveal
    {
        public int questionId { get; set; }
        public string questionText { get; set; }
        public string questionType { get; set; } // For example: "open" or "multiple-choice"
    }
}
