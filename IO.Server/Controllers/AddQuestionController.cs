using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Diagnostics;
using System.Globalization;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionFranekController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public QuestionFranekController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpPost("{testId}")]
        public IActionResult AddQuestionToTest(int testId, [FromBody] Question newQuestion)
        {
            try
            {
                _connection.Open();

                // Wstawienie nowego pytania do tabeli Question
                string insertQuestionQuery = "INSERT INTO \"Question\" (name, category, questiontype, answer, shared, a, b, c, d, maxpoints, questionbody) " +
                    $"VALUES('{newQuestion.name}','{newQuestion.category}' ,'{newQuestion.questionType}' ,'{newQuestion.answer}' ,'{newQuestion.shared}' ,'{newQuestion.a}' ,'{newQuestion.b}' , '{newQuestion.c}', '{newQuestion.d}', '{newQuestion.maxPoints}', '{newQuestion.questionBody}') " +
                    "RETURNING questionid";

                int newQuestionId;
                using (var command = new NpgsqlCommand(insertQuestionQuery, _connection))
                {
                    newQuestionId = Convert.ToInt32(command.ExecuteScalar());
                }

                // Powiązanie pytania z testem w tabeli QuestionToTest
                string insertQuestionToTestQuery = @"
                    INSERT INTO ""QuestionToTest"" (testid, questionid)
                    VALUES(@testId, @questionId); ";

                using (var command = new NpgsqlCommand(insertQuestionToTestQuery, _connection))
                {
                    command.Parameters.AddWithValue("@testId", testId);
                    command.Parameters.AddWithValue("@questionId", newQuestionId);
                    command.ExecuteNonQuery();
                }

                return Ok(new { QuestionId = newQuestionId, Message = "Question added and linked to test successfully." });
            }
            catch (Exception ex)
            {
                Debug.Print(ex.ToString());
                return StatusCode(500, "Error during adding question");
            }
            finally
            {
                _connection.Close();
            }
        }
        
        // New method with fixed Question fetching. PLEASE DONT DELETE!!!!!!!!!!!!
        [HttpPost("FRANEKGPT/{testId}")]
        public IActionResult AddQuestionToTestV2(int testId, [FromBody] Elements.Question quest)
        {
            Debug.Print("\n\n\n\n\n\n\n\n\n\n\nFrankowanie\n\n");
            // Check if quest is properly sent
            if (quest.IsEmpty())
            {
                quest.PrintQuestionOnConsole();
                return StatusCode(500, "Invalid Question");
            }
            try
            {
                _connection.Open();

                // Wstawienie nowego pytania do tabeli Question
                string insertQuestionQuery = "INSERT INTO \"Question\" (name, category, questiontype, answer, shared, a, b, c, d, maxpoints, questionbody) " +
                    $"VALUES('{quest.Name}','{quest.Category}','{quest.QuestionType}','{quest.Answers}','{quest.Shared}','{quest.ReturnCorrectAnswerSingle(Elements.Question.QUESTION_ANSWER.A)}'," +
                    $"'{quest.ReturnCorrectAnswerSingle(Elements.Question.QUESTION_ANSWER.B)}','{quest.ReturnCorrectAnswerSingle(Elements.Question.QUESTION_ANSWER.C)}'," +
                    $"'{quest.ReturnCorrectAnswerSingle(Elements.Question.QUESTION_ANSWER.D)}','{quest.Points.ToString(CultureInfo.InvariantCulture)}','{quest.Text}') " +
                    "RETURNING questionid";
                int newQuestionId;
                using (var command = new NpgsqlCommand(insertQuestionQuery, _connection))
                {
                    newQuestionId = Convert.ToInt32(command.ExecuteScalar());
                }

                // Powiązanie pytania z testem w tabeli QuestionToTest
                string insertQuestionToTestQuery = @"
                    INSERT INTO ""QuestionToTest"" (testid, questionid)
                    VALUES(@testId, @questionId); ";

                using (var command = new NpgsqlCommand(insertQuestionToTestQuery, _connection))
                {
                    command.Parameters.AddWithValue("@testId", testId);
                    command.Parameters.AddWithValue("@questionId", newQuestionId);
                    command.ExecuteNonQuery();
                }

                return Ok(new { QuestionId = newQuestionId, Message = "Question added and linked to test successfully." });
            }
            catch (Exception ex)
            {
                Debug.Print(ex.ToString());
                return StatusCode(500, "Error during adding question");
            }
            finally
            {
                _connection.Close();
            }
        }

        [HttpGet("{testId}")]
        public IActionResult GetQuestionsForTest(int testId)
        {
            try
            {
                _connection.Open();

                string query = @"
            SELECT q.questionid, q.name, q.category, q.questiontype, q.shared, 
                   q.answer, q.a, q.b, q.c, q.d, q.maxpoints, q.questionbody
            FROM ""Question"" q
            INNER JOIN ""QuestionToTest"" qt ON q.questionid = qt.questionid
            WHERE qt.testid = @testId;";

                var questions = new List<Question>();

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@testId", testId);
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            questions.Add(new Question
                            {
                                questionId = (int)reader["questionid"],
                                name = reader["name"].ToString(),
                                category = reader["category"].ToString(),
                                questionType = reader["questiontype"].ToString(),
                                shared = (bool)reader["shared"],
                                answer = (string)reader["answer"],
                                a = (bool)reader["a"], 
                                b = (bool)reader["b"], 
                                c = (bool)reader["c"],
                                d = (bool)reader["d"],
                                maxPoints = (double)reader["maxpoints"],
                                questionBody = reader["questionbody"].ToString(),
                            });
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


        public class Question
        {
            public int questionId { get; set; }
            public string name { get; set; }
            public string category { get; set; }
            public string questionType { get; set; }
            public bool shared { get; set; }
            public string answer { get; set; }
            public bool a { get; set; }
            public bool b { get; set; }
            public bool c { get; set; }
            public bool d { get; set; }
            public double maxPoints { get; set; }
            public string questionBody { get; set; }
        }
    }
}