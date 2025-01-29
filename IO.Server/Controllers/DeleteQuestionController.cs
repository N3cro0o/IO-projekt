using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;

[Route("api/DeleteQuestion")]
[ApiController]
public class DeleteQuestionController : ControllerBase
{
    private readonly NpgsqlConnection _connection;

    // Konstruktor przyjmujący połączenie do bazy danych
    public DeleteQuestionController(NpgsqlConnection connection)
    {
        _connection = connection;
    }

    // Metoda do usuwania pytania po jego nazwie
    [HttpDelete("DeleteQuestionByName/{questionName}")]
    public ActionResult DeleteQuestionByName(string questionName)
    {
        try
        {
            // Otwieranie połączenia z bazą danych
            _connection.Open();

            const string query = @"DELETE FROM ""Question"" WHERE name = @QuestionName";

            // Przygotowanie i wykonanie zapytania SQL
            using (var command = new NpgsqlCommand(query, _connection))
            {
                command.Parameters.AddWithValue("@QuestionName", questionName);

                int rowsAffected = command.ExecuteNonQuery();

                // Jeśli brak wierszy do usunięcia, zwróć 404
                if (rowsAffected == 0)
                {
                    return NotFound(new { message = $"No question found with name '{questionName}'." });
                }
            }

            // Logowanie i zwrócenie odpowiedzi sukcesu
            Console.WriteLine($"Question with name '{questionName}' was successfully deleted.");
            return Ok(new { message = $"Question with name '{questionName}' has been deleted." });
        }
        catch (Exception ex)
        {
            // Obsługa błędów
            Console.WriteLine($"Error while deleting question: {ex.Message}");
            return StatusCode(500, new { message = "Internal server error.", details = ex.Message });
        }
        finally
        {
            // Zamknięcie połączenia
            _connection.Close();
        }
    }
}
