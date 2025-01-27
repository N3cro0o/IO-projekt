using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;

[Route("api/EditQuestion")]
[ApiController]
public class EditQuestionController : ControllerBase
{
    private readonly NpgsqlConnection _connection;

    public EditQuestionController(NpgsqlConnection connection)
    {
        _connection = connection;
    }

    [HttpPut("EditQuestion/{questionId}")]
    public ActionResult EditQuestion(int questionId, [FromBody] QuestionUpdateModel updatedQuestion)
    {
        try
        {
            _connection.Open();

            const string query = @"
            UPDATE ""Question"" 
            SET name = @Name, category = @Category, questionType = @QuestionType, 
                shared = @Shared, maxPoints = @MaxPoints
            WHERE id = @QuestionId";

            using (var command = new NpgsqlCommand(query, _connection))
            {
                command.Parameters.AddWithValue("@QuestionId", questionId);
                command.Parameters.AddWithValue("@Name", updatedQuestion.Name);
                command.Parameters.AddWithValue("@Category", updatedQuestion.Category);
                command.Parameters.AddWithValue("@QuestionType", updatedQuestion.QuestionType);
                command.Parameters.AddWithValue("@Shared", updatedQuestion.Shared);
                command.Parameters.AddWithValue("@MaxPoints", updatedQuestion.MaxPoints);

                int rowsAffected = command.ExecuteNonQuery();

                if (rowsAffected == 0)
                {
                    return NotFound($"No question found with ID {questionId}.");
                }
            }

            // Obsługa pytań zamkniętych
            if (updatedQuestion.QuestionType == "closed")
            {
                const string answerQuery = @"
                UPDATE ""Answers"" 
                SET answerA = @AnswerA, answerB = @AnswerB, answerC = @AnswerC, 
                    answerD = @AnswerD, correctAnswer = @CorrectAnswer
                WHERE questionId = @QuestionId";

                using (var command = new NpgsqlCommand(answerQuery, _connection))
                {
                    command.Parameters.AddWithValue("@QuestionId", questionId);
                    command.Parameters.AddWithValue("@AnswerA", updatedQuestion.AnswerA ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@AnswerB", updatedQuestion.AnswerB ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@AnswerC", updatedQuestion.AnswerC ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@AnswerD", updatedQuestion.AnswerD ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@CorrectAnswer", updatedQuestion.CorrectAnswer ?? (object)DBNull.Value);

                    command.ExecuteNonQuery();
                }
            }

            return Ok($"Question with ID {questionId} has been updated.");
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


public class QuestionUpdateModel
{
    public string Name { get; set; }
    public string Category { get; set; }
    public string QuestionType { get; set; }
    public bool Shared { get; set; }
    public int MaxPoints { get; set; }

    // Pola wymagane dla pytań zamkniętych
    public string? AnswerA { get; set; }
    public string? AnswerB { get; set; }
    public string? AnswerC { get; set; }
    public string? AnswerD { get; set; }
    public string? CorrectAnswer { get; set; }
}
