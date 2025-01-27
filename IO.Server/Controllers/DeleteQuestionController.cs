using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;

[Route("api/DeleteQuestion")]
[ApiController]
public class DeleteQuestionController : ControllerBase
{
    private readonly NpgsqlConnection _connection;

    public DeleteQuestionController(NpgsqlConnection connection)
    {
        _connection = connection;
    }

    [HttpDelete("DeleteQuestion/{questionId}")]
    public ActionResult DeleteQuestion(int questionId)
    {
        try
        {
            _connection.Open();

            const string query = @"DELETE FROM ""Question"" WHERE questionid = @QuestionId";

            using (var command = new NpgsqlCommand(query, _connection))
            {
                command.Parameters.AddWithValue("@QuestionId", questionId);

                int rowsAffected = command.ExecuteNonQuery();

                if (rowsAffected == 0)
                {
                    return NotFound($"No question found with ID {questionId}.");
                }
            }

            Console.WriteLine($"Question with ID {questionId} was successfully deleted.");
            return Ok($"Question with ID {questionId} has been deleted.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error while deleting question: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
        finally
        {
            _connection.Close();
        }
    }
}
