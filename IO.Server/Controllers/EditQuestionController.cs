using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Threading.Tasks;

[Route("api/EditQuestion")]
[ApiController]
public class EditQuestionController : ControllerBase
{
    private readonly NpgsqlConnection _connection;

    public EditQuestionController(NpgsqlConnection connection)
    {
        _connection = connection;
    }

    [HttpPut("EditQuestionByName/{name}")]
    public async Task<IActionResult> EditQuestionByName(string name, [FromBody] QuestionUpdateRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(name))
        {
            return BadRequest(new { message = "Invalid data provided." });
        }

        // Valid question types
        var validQuestionTypes = new[] { "open", "closed", "multiple" };

        if (!validQuestionTypes.Contains(request.QuestionType))
        {
            return BadRequest(new { message = $"Invalid question type. Allowed types: {string.Join(", ", validQuestionTypes)}" });
        }

        try
        {
            await _connection.OpenAsync();

            const string query = @"
            UPDATE ""Question""
            SET
                category = @Category,
                questiontype = @QuestionType::qtype,
                shared = @Shared,
                maxpoints = @MaxPoints,
                answer = @Answer,
                a = @A,
                b = @B,
                c = @C,
                d = @D,
                question = @Question
            WHERE name = @Name";

            using (var command = new NpgsqlCommand(query, _connection))
            {
                command.Parameters.AddWithValue("@Name", name);
                command.Parameters.AddWithValue("@Category", request.Category);
                command.Parameters.AddWithValue("@QuestionType", request.QuestionType);
                command.Parameters.AddWithValue("@Shared", request.Shared);
                command.Parameters.AddWithValue("@MaxPoints", request.MaxPoints);
                command.Parameters.AddWithValue("@Answer", (object?)request.Answer ?? DBNull.Value);
                command.Parameters.AddWithValue("@A", (object?)request.A ?? DBNull.Value);
                command.Parameters.AddWithValue("@B", (object?)request.B ?? DBNull.Value);
                command.Parameters.AddWithValue("@C", (object?)request.C ?? DBNull.Value);
                command.Parameters.AddWithValue("@D", (object?)request.D ?? DBNull.Value);
                command.Parameters.AddWithValue("@Question", (object?)request.Question ?? DBNull.Value);

                int rowsAffected = await command.ExecuteNonQueryAsync();

                if (rowsAffected == 0)
                {
                    return NotFound(new { message = "Question not found." });
                }
            }

            return Ok(new { message = "Question updated successfully." });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error updating question: {ex.Message}");
            return StatusCode(500, new { message = "An error occurred while updating the question.", details = ex.Message });
        }
        finally
        {
            await _connection.CloseAsync();
        }
    }
    //Wyświetlanie Pytań Otwartych Do Testu Ownera Do Sprawdzenia
    [HttpGet("QuestionList/{testId}")]
    public ActionResult<IEnumerable<QuestionToShow>> GetQuestion(int testId)
    {
        var question = new List<QuestionToShow>();

        try
        {
            _connection.Open();

            const string query = @"SELECT a.answerid, q.name, q.questionbody, a.answer, a.points, q.maxpoints
                    FROM ""Answer"" a 
                    JOIN ""Question"" q ON a.questionid = q.questionid
                    JOIN ""Test"" t ON a.testid = t.testid
                    JOIN ""QuestionToTest"" qtt ON qtt.testid = t.testid AND qtt.questionid = q.questionid
                    WHERE a.a = false
                      AND a.b = false
                      AND a.c = false
                      AND a.d = false
                      AND t.testid = @testId;" ;

            using (var command = new NpgsqlCommand(query, _connection))

            {
                command.Parameters.AddWithValue("@testId", testId);
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var quest = new QuestionToShow
                        {
                            aID = reader.GetInt32(0),
                            qName = reader.GetString(1),
                            qBody = reader.GetString(2),
                            aAnswer = reader.GetString(3),
                            aPoints = reader.GetDouble(4),
                            qMaxPoints = reader.GetDouble(5)
                        };
                        question.Add(quest);
                        Console.WriteLine($"ID{quest.aID} Name{quest.qName} maxPoint{quest.qMaxPoints}");
                    }
                }
            }
            Console.WriteLine($"Łączna liczba testów dla kursu: {question.Count}");

            if (question.Count == 0)
            {
                return NotFound("Ni ma ");
            }

            return Ok(question);
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
    [HttpPost("answer/review")]
    public ActionResult ReviewAnswer([FromBody] AnswerReviewRequest request)
    {
        if (request == null || request.AnswerId <= 0 || request.Points < 0)
        {
            return BadRequest("Invalid data.");
        }

        var query = "UPDATE \"Answer\" SET points = @Points WHERE answerid = @AnswerId";

        try
        {
            
            _connection.Open();

            using (var command = new NpgsqlCommand(query, _connection))
            {
                
                command.Parameters.AddWithValue("@Points", request.Points);
                command.Parameters.AddWithValue("@AnswerId", request.AnswerId);

                
                var rowsAffected = command.ExecuteNonQuery();

                if (rowsAffected == 0)
                {
                    return NotFound("Answer not found.");
                }

                
                return Ok("Points updated successfully.");
            }
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
    // Wyświetlanie Testów
    [HttpGet("TestsList/{ownerId}/tests")]
    public ActionResult<IEnumerable<Test>> GetTestsByOwnerId(int ownerId)
    {
        var tests = new List<Test>();

        try
        {
            _connection.Open();

            const string query = @"
            SELECT t.testid, t.name, t.starttime, t.endtime, t.category, t.courseid 
            FROM ""Test"" t
            Join ""Course"" c ON c.courseid = t.courseid
            WHERE c.ownerid = @ownerId";

            using (var command = new NpgsqlCommand(query, _connection))
            {
                command.Parameters.AddWithValue("@CourseId", ownerId);

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        if (reader.GetDateTime(3) != DateTime.Now)//Wyswietla teylko testy ukonczone jesli jest "<" zamiast "!=" <- do testowania
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
                            Console.WriteLine($"Test wczytany: ID={test.TestId}, Name={test.Category}, CourseID={test.CourseId}");
                        }
                        
                    }
                }
            }

            Console.WriteLine($"Łączna liczba testów dla kursu {ownerId}: {tests.Count}");

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
}


public class QuestionUpdateRequest
{
    public string Name { get; set; }
    public string Category { get; set; }
    public string QuestionType { get; set; }
    public bool Shared { get; set; }
    public int MaxPoints { get; set; }
    public string? Answer { get; set; }
    public bool? A { get; set; }
    public bool? B { get; set; }
    public bool? C { get; set; }
    public bool? D { get; set; }
    public string? Question { get; set; }
}

public class QuestionToShow
{
    public int aID { get; set; }
    public string qName { get; set; }
    public string qBody { get; set; }
    public string aAnswer { get; set; }
    public double aPoints { get; set; }
    public double qMaxPoints { get; set; }
}

public class AnswerReviewRequest
{
    public int AnswerId { get; set; }
    public int Points { get; set; }
}

