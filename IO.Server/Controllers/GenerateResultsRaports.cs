using System.Diagnostics;
using System.Text.RegularExpressions;
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
            SELECT u.userid, u.name, COALESCE(SUM(a.points), 0) AS totalPoints
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
                            Console.WriteLine($"id: {userScore.UserId}, name: {userScore.UserName}, points: {userScore.TotalPoints}");
                        }
                        reader.Close(); 

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
            Console.WriteLine($"Odpala BMW");
            var results = new List<TestResult>();

                try
                {
                    _connection.Open();

                    const string query = @"
                        SELECT t.name, t.category, r.points
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
                                    Points = reader.GetDouble(2),
                                    
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
        [HttpGet("{testId}")]
        public ActionResult<TestInfo> GetTestInfo(int testId)
        {
            Console.WriteLine($"Odpala Skoda");
            try
            {
                _connection.Open();
                const string query = @"SELECT t.name, SUM(q.maxpoints) 
                                      FROM ""Test"" t
                                      JOIN ""QuestionToTest"" qtt ON qtt.testid = t.testid
                                      JOIN ""Question"" q ON q.questionid = qtt.questionid
                                      WHERE t.testid = @TestId
                                      GROUP BY t.testid; ";

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@TestId", testId);
                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            Console.WriteLine($"name: {reader.GetString(0)}, points: {reader.GetDouble(1)}");
                            return Ok(new TestInfo
                            {
                                TestName = reader.GetString(0),
                                MaxPoints = reader.GetDouble(1)
                            });
                            
                        }
                        return NotFound("Test not found");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
            finally
            {
                _connection.Close();
            }
        }

        [HttpGet("{testId}/results")]
        public ActionResult<IEnumerable<TestRaprts>> GetTestResults(int testId)
        {
            Console.WriteLine($"Odpala Matiz");
            try
            {
                _connection.Open();
                double maxPoints = 0.0;
                const string maxPointsQuery = @"SELECT SUM(q.maxpoints) FROM ""QuestionToTest"" qtt
                                              JOIN ""Question"" q ON q.questionid = qtt.questionid
                                              WHERE qtt.testid = @TestId";
                using (var command = new NpgsqlCommand(maxPointsQuery, _connection))
                {
                    command.Parameters.AddWithValue("@TestId", testId);
                    object result = command.ExecuteScalar();
                    if (result != DBNull.Value)
                    {
                        maxPoints = Convert.ToDouble(result);
                    }
                }

                const string resultsQuery = @"SELECT u.userid, u.name, u.surname, u.email, r.points 
                                             FROM ""Results"" r 
                                             JOIN ""User"" u ON u.userid = r.userid 
                                             WHERE r.testid = @TestId";

                using (var command = new NpgsqlCommand(resultsQuery, _connection))
                {
                    command.Parameters.AddWithValue("@TestId", testId);
                    using (var reader = command.ExecuteReader())
                    {
                        var results = new List<TestRaprts>();
                        while (reader.Read())
                        {
                            var testResult = new TestRaprts
                            {
                                UserId = reader.GetInt32(0),
                                Name = reader.GetString(1),
                                Surname = reader.GetString(2),
                                Email = reader.GetString(3),
                                Points = reader.GetDouble(4),
                                Passed = reader.GetDouble(4) >= (maxPoints * 0.5)
                            };
                            results.Add(testResult);
                        }
                        return Ok(results);
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
            finally
            {
                _connection.Close();
            }
        }
    }

    


}
    public class UserScore
    {
        public int UserId { get; set; } 
        public string UserName { get; set; } 
        public double TotalPoints { get; set; } 
    }
        public class TestResult
        {
            public string TestName { get; set; }
            public string Category { get; set; }
            public double Points { get; set; }
 
        }

public class TestInfo
{
    public string TestName { get; set; }
    public double MaxPoints { get; set; }
}

public class TestRaprts
{
    public int UserId { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Email { get; set; }
    public double Points { get; set; }
    public bool Passed { get; set; }
}
