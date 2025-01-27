using System.Diagnostics;
using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace IO.Server.Controllers
{
    //listowanie kursów
    [ApiController]
    [Route("api/[controller]")]
    public class TestVievController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;
        public int testPoints;

        public TestVievController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpGet("ListTest/{userId}")]
        public ActionResult<IEnumerable<TestToReveal>> GetTest(int userId)
        {
            List<TestToReveal> test = new List<TestToReveal>();

            try
            {
                _connection.Open();

                // Query to fetch courses
                string query = @"
                    SELECT t.testid, t.name, t.category 
                    FROM ""UserToCourse"" utc
                    JOIN ""Course"" c ON utc.courseid = c.courseid
                    JOIN ""Test"" t ON t.courseid = c.courseid
                    JOIN ""User"" u ON utc.userid = u.userid
                    WHERE u.userid = @userId";

                using (var command = new NpgsqlCommand(query, _connection))
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        // Safely retrieve data and handle nullability
                        int testId = reader.GetFieldValue<int>(0);
                        string testName = reader.GetFieldValue<string>(1);
                        string cattegory = reader.GetFieldValue<string>(2);


                        var testToReveal = new TestToReveal
                        {
                            testid = testId,
                            testName = testName,
                            cattegory = cattegory
                        };

                        test.Add(testToReveal);
                    }
                }

                return Ok(test);
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
        public ActionResult<IEnumerable<QuestionToReveal>> GetQuestion(int testId)
        {
            List<QuestionToReveal> question = new List<QuestionToReveal>();

            try
            {
                _connection.Open();

                // Query to fetch courses
                string query = @"SELECT q.*, t.testid
                    FROM  ""Question"" q, ""QuestionToTest"" qtt, ""Test"" t
                    WHERE qtt.testid = t.testid AND qtt.questionid = q.questionid AND t.testid = @testId";

                using (var command = new NpgsqlCommand(query, _connection))
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        int questionId = reader.GetFieldValue<int>(0);
                        string questionName = reader.GetFieldValue<string>(1);
                        string questionCattegory = reader.GetFieldValue<string>(2);
                        string questionType = reader.GetFieldValue<string>(3);
                        bool questionShared = reader.GetFieldValue<bool>(4);
                        string questionAnswer = reader.GetFieldValue<string>(5);
                        bool a = reader.GetFieldValue<bool>(6);
                        bool b = reader.GetFieldValue<bool>(7);
                        bool c = reader.GetFieldValue<bool>(8);
                        bool d = reader.GetFieldValue<bool>(9);
                        string questionQ = reader.GetFieldValue<string>(10);
                        int maxPoint = reader.GetFieldValue<int>(11);

                        // Create the QuestionToReveal object
                        QuestionToReveal questionToReveal = new QuestionToReveal
                        {
                            questionid = questionId,
                            questionName = questionName,
                            cattegory = questionCattegory,
                            questiontype = questionType,
                            shared = questionShared,
                            answer = questionAnswer,
                            a = a,
                            b = b,
                            c = c,
                            d = d,
                            question = questionQ,
                            maxpoint = maxPoint
                        };
                        question.Add(questionToReveal);
                    }
                }
                return Ok(question);
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






        public class TestToReveal
        {
            public int testid { get; set; }
            public string testName { get; set; }
            public string cattegory { get; set; }
        }
        public class QuestionToReveal
        {
            public int questionid { get; set; }
            public string questionName { get; set; }
            public string cattegory { get; set; }
            public string questiontype { get; set; }

            public bool shared { get; set; }
            public string answer { get; set; }
            public bool a { get; set; }
            public bool b { get; set; }
            public bool c { get; set; }
            public bool d { get; set; }

            public string question { get; set; }

            public int maxpoint { get; set; }



        }
    }
}
