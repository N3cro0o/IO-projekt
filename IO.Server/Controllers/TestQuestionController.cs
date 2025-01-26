using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestQuestionController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public TestQuestionController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpGet("{testId}/questions")]
        public ActionResult<IEnumerable<Question>> GetQuestionsByTestId(int testId)
        {
            List<Question> questions = new List<Question>();

            try
            {
                _connection.Open();

                string query = @"
                    SELECT q.questionid, q.name, q.category, q.questiontype, q.shared
                    FROM ""QuestionToTest"" qt
                    JOIN ""Question"" q ON qt.questionid = q.questionid
                    WHERE qt.testid = @testId
                    ORDER BY q.questionid ASC";

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@testId", testId);

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var question = new Question(
                                id: reader.GetInt32(0),
                                name: reader.GetString(1),
                                category: reader.GetString(2),
                                questionType: reader.GetString(3),
                                shared: reader.GetBoolean(4)
                                
                              
                            );
                            questions.Add(question);
                        }
                    }
                }

                return Ok(questions);
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

        [HttpPost("{testId}/questions")]
        public IActionResult AddQuestion(int testId, [FromBody] Question newQuestion)
        {
            try
            {
                _connection.Open();

                string insertQuestionQuery = @"
                    INSERT INTO ""Question"" (name, category, questiontype, shared, maxpoints, answerid)
                    VALUES (@name, @category, @questionType, @shared)
                    RETURNING questionid";

                int newQuestionId;
                using (var command = new NpgsqlCommand(insertQuestionQuery, _connection))
                {
                    command.Parameters.AddWithValue("@name", newQuestion.Name);
                    command.Parameters.AddWithValue("@category", newQuestion.Category);
                    command.Parameters.AddWithValue("@questionType", newQuestion.QuestionType);
                    command.Parameters.AddWithValue("@shared", newQuestion.Shared);
                   

                    newQuestionId = Convert.ToInt32(command.ExecuteScalar());
                }

                string insertQuestionToTestQuery = @"
                    INSERT INTO ""QuestionToTest"" (testid, questionid)
                    VALUES (@testId, @questionId)";

                using (var command = new NpgsqlCommand(insertQuestionToTestQuery, _connection))
                {
                    command.Parameters.AddWithValue("@testId", testId);
                    command.Parameters.AddWithValue("@questionId", newQuestionId);
                    command.ExecuteNonQuery();
                }

                return Ok(new { QuestionId = newQuestionId });
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

    public class Question
    {
        public int Id { get; }
        public string Name { get; }
        public string Category { get; }
        public string QuestionType { get; }
        public bool Shared { get; }
        

        public Question(int id, string name, string category, string questionType, bool shared)
        {
            Id = id;
            Name = name;
            Category = category;
            QuestionType = questionType;
            Shared = shared;
            
        }
    }
}
