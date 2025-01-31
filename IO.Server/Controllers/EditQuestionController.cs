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

