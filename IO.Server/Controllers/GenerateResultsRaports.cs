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
                _connection.Open();

                const string selectQuery = @"
            SELECT u.userid, u.name, SUM(a.points) AS totalPoints
            FROM ""User"" u
            JOIN ""Answer"" a ON u.userid = a.userid
            WHERE a.testid = @TestId
            GROUP BY u.userid, u.name
            ORDER BY totalPoints DESC";

                using (var command = new NpgsqlCommand(selectQuery, _connection))
                {
                    command.Parameters.AddWithValue("@TestId", testId);

                    using (var reader = command.ExecuteReader())
                    {
                        var userScores = new List<UserScore>();

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

                        reader.Close(); // Zamykamy reader przed wykonaniem kolejnych zapytañ

                        // Jeœli s¹ wyniki, zapisujemy je do tabeli "Results"
                        if (userScores.Count > 0)
                        {
                            foreach (var score in userScores)
                            {
                                const string upsertQuery = @"
                            INSERT INTO ""Results"" (testid, userid, points) 
                            VALUES (@TestId, @UserId, @Points)
                            ON CONFLICT (testid, userid) 
                            DO UPDATE SET points = EXCLUDED.points;";

                                using (var upsertCommand = new NpgsqlCommand(upsertQuery, _connection))
                                {
                                    upsertCommand.Parameters.AddWithValue("@TestId", testId);
                                    upsertCommand.Parameters.AddWithValue("@UserId", score.UserId);
                                    upsertCommand.Parameters.AddWithValue("@Points", score.TotalPoints);
                                    upsertCommand.ExecuteNonQuery();
                                }
                            }
                            return Ok(userScores);
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
                Console.WriteLine($"B³¹d: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                _connection.Close();
            }
        }



            [HttpGet("Results/{userId}")]
            public ActionResult<IEnumerable<TestResult>> GetResultsByUserId(int userId)
            {
                var results = new List<TestResult>();

                try
                {
                    _connection.Open();

                    const string query = @"
                        SELECT t.name, t.category, r.points, r.feedback 
                        FROM ""Results"" r 
                        JOIN ""Test"" t ON t.testid = r.testid 
                        WHERE r.userid = @userId";
    
                using (var command = new NpgsqlCommand(query, _connection))
                    {
                        command.Parameters.AddWithValue("@userId", userId);

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var result = new TestResult
                                {
                                    TestName = reader.GetString(0),
                                    Category = reader.GetString(1),
                                    Points = reader.GetInt32(2),
                                    Feedback = reader.IsDBNull(3) ? null : reader.GetString(3)
                                };
                                results.Add(result);
                            }
                        }
                    }

                    if (results.Count == 0)
                    {
                        return NotFound("No results found for the specified user ID.");
                    }

                    return Ok(results);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
                finally
                {
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
        public class TestResult
        {
            public string TestName { get; set; }
            public string Category { get; set; }
            public int Points { get; set; }
            public string Feedback { get; set; }
        }

    }
