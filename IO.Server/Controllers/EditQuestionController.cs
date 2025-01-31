using Microsoft.AspNetCore.Mvc;
using Npgsql;
using IO.Server.Elements;
using System;
using System.Threading.Tasks;
using System.Diagnostics;
using System.Globalization;


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
    
    [HttpPost("franiowanie/question")]
    public IActionResult EditQuestionByBody([FromBody] Question request)
    {
        if (request.IsEmpty())
        {
            throw new ArgumentNullException(nameof(request.Name));
        }
        Debug.Print("\n\n\n\n\n\n\n\n\n\n\n\n\n1");
        request.PrintQuestionOnConsole();
        try
        {
            _connection.Open();

            int a = (request.CorrectAnswers & (1 << 3)) >> 3;
            int b = (request.CorrectAnswers & (1 << 2)) >> 2;
            int c = (request.CorrectAnswers & (1 << 1)) >> 1;
            int d = (request.CorrectAnswers & (1 << 0)) >> 0;
            int shared = request.Shared ? 1 : 0;
            Debug.Print("\n\n\n\n\n\n\n\n\n\n\n\n\n1");
            string query_question = $"UPDATE \"Question\" SET name = '{request.Name}', category = '{request.Category}', " +
                $"questiontype = '{request.QuestionType.ToString().ToLower()}', shared = '{shared}', maxpoints = '{request.Points.ToString(CultureInfo.InvariantCulture)}', questionbody = '{request.Text}', " +
                $"answer = '{request.Answers}', a = '{a}', b = '{b}', c = '{c}', d = '{d}' WHERE \"questionid\" = '{request.ID}'";
            var command = new NpgsqlCommand(query_question, _connection);
            Debug.Print("\n\n\n\n\n\n\n\n\n\n\n\n\n1");
            command.ExecuteNonQuery();
            Debug.Print("\n\n\n\n\n\n\n\n\n\n\n\n\n1");
            return Ok(new { message = "Question updated successfully." });
        }
        catch (Exception ex)
        {
            Debug.Print(ex.ToString());
            return StatusCode(500, new { message = "An error occurred while updating the question.", details = ex.Message });
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
