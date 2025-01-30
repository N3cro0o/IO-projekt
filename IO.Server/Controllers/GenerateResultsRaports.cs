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
                // Otwieramy po��czenie z baz�
                _connection.Open();

                // Zapytanie SQL, kt�re pobiera dane o uczniach i ich punktach dla danego testu
                const string query = @"
            SELECT u.userid, u.name, SUM(a.points) AS totalPoints
            FROM ""User"" u
            JOIN ""Answer"" a ON u.userid = a.userid
            WHERE a.testid = @TestId
            GROUP BY u.userid, u.name
            ORDER BY totalPoints DESC"; // Mo�esz zmieni� ORDER BY wed�ug w�asnych potrzeb

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
                            return Ok(userScores); // Zwracamy list� uczni�w z ich punktami
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
                // Obs�uga b��d�w, zwr�cenie 500 w przypadku problemu z baz� danych
                Console.WriteLine($"B��d: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                // Zamkni�cie po��czenia z baz� danych
                _connection.Close();
            }
        }

    }
    public class UserScore
    {
        public int UserId { get; set; } // Identyfikator u�ytkownika
        public string UserName { get; set; } // Nazwa u�ytkownika
        public double TotalPoints { get; set; } // Suma punkt�w zdobytych przez u�ytkownika
    }

}
