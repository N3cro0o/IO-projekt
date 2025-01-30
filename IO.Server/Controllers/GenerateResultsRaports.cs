using System.Diagnostics;
using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Npgsql;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GenerateResultsRaports : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public GenerateResultsRaports(NpgsqlConnection connection)
        {
            _connection = connection;
        }


    
        // Pobranie i sprawdzanie wyniku ucznia
        [HttpGet("GetUserScores/{testId}")]
        public ActionResult<IEnumerable<UserScore>> GetUserScoresByTestId(int testId)
        {
            try
            {
                // Otwieramy po³¹czenie z baz¹
                _connection.Open();

                // Zapytanie SQL, które pobiera dane o uczniach i ich punktach dla danego testu
                const string query = @"
            SELECT u.userid, u.name, SUM(a.points) AS totalPoints
            FROM ""User"" u
            JOIN ""Answer"" a ON u.userid = a.userid
            WHERE a.testid = @TestId
            GROUP BY u.userid, u.name
            ORDER BY totalPoints DESC"; // Mo¿esz zmieniæ ORDER BY wed³ug w³asnych potrzeb

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    // Dodanie parametru do zapytania (testId)
                    command.Parameters.AddWithValue("@TestId", testId);

                    // Wykonanie zapytania
                    using (var reader = command.ExecuteReader())
                    {
                        var userScores = new List<UserScore>();

                        // Przechodzimy przez wyniki zapytania
                        while (reader.Read())
                        {
                            var userScore = new UserScore
                            {
                                UserId = reader.GetInt32(0),
                                UserName = reader.GetString(1),
                                TotalPoints = reader.GetDouble(2)
                            };
                            userScores.Add(userScore);
                        }

                        if (userScores.Count > 0)
                        {
                            return Ok(userScores); // Zwracamy listê uczniów z ich punktami
                        }
                        else
                        {
                            return NotFound("No students found for the specified test.");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Obs³uga b³êdów, zwrócenie 500 w przypadku problemu z baz¹ danych
                Console.WriteLine($"B³¹d: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                // Zamkniêcie po³¹czenia z baz¹ danych
                _connection.Close();
            }
        }

    }
    public class UserScore
    {
        public int UserId { get; set; } // Identyfikator u¿ytkownika
        public string UserName { get; set; } // Nazwa u¿ytkownika
        public double TotalPoints { get; set; } // Suma punktów zdobytych przez u¿ytkownika
    }

}
