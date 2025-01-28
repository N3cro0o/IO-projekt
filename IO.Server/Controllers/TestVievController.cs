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
                    SELECT 
                        t.testid, 
                        t.name AS test_name, 
                        t.category AS test_category
                    FROM 
                        ""UserToCourse"" utc
                    JOIN
                        ""Course"" c ON utc.courseid = c.courseid
                    JOIN
                        ""Test"" t ON c.courseid = t.courseid";



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
                            testCattegory = cattegory
                        };

                        test.Add(testToReveal);
                        
                    }
                }
                foreach (var item in test)
                {
                    Console.WriteLine($"TestId: {item.testid}, TestName: {item.testName}, TestCategory: {item.testCattegory}");
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

        [HttpGet("GetQuestion/{testId}")]
        public ActionResult<IEnumerable<QuestionToReveal>> GetQuestion(int testId)
        {
            List<QuestionToReveal> question = new List<QuestionToReveal>();

            try
            {
                _connection.Open();

                // Query to fetch questions related to the test
                string query = @"SELECT q.*, t.testid
                         FROM  ""Question"" q
                         JOIN ""QuestionToTest"" qtt ON qtt.questionid = q.questionid
                         JOIN ""Test"" t ON qtt.testid = t.testid
                         WHERE t.testid = @testId";

                using (var command = new NpgsqlCommand(query, _connection))
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var questionToReveal = new QuestionToReveal
                        {
                            questionid = reader.GetInt32(0),
                            questionName = reader.GetString(1),
                            question = reader.GetString(10),  // Assuming the question text is the 10th column
                            a = reader.GetBoolean(6),
                            b = reader.GetBoolean(7),
                            c = reader.GetBoolean(8),
                            d = reader.GetBoolean(9),
                            answer = reader.GetString(5),  // Assuming the correct answer is stored in column 5
                            maxpoint = reader.GetInt32(11)
                        };
                        question.Add(questionToReveal);
                    }
                }
                return Ok(question);
            }
            catch (Exception ex)
            {
                Debug.Print(ex.ToString());
                return BadRequest(new { message = "An error occurred while fetching questions.", details = ex.Message });
            }
            finally
            {
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
            public string testCattegory { get; set; }
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
