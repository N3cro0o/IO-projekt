using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using IO.Server.Elements;
using System.Diagnostics;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public LoginController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginData data)
        {

            if (data == null)
            {
                return BadRequest("Dane nie mogą być puste");
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                _connection.Open();

                // Zapytanie SQL w celu pobrania użytkownika na podstawie loginu
                string query = "SELECT login, password, role FROM \"User\" WHERE login = @login";
                using (var command = new NpgsqlCommand(query, _connection))
                {
                    // Dodanie parametru zapytania SQL
                    command.Parameters.AddWithValue("@login", data.Login);

                    using (var reader = command.ExecuteReader())
                    {
                        if (!reader.Read())
                        {
                            // Brak użytkownika w bazie danych
                            return Unauthorized(new { Message = "Invalid Username" });
                        }

                        // Pobranie hasła z bazy danych
                        var storedPassword = reader.GetString(1); // Druga kolumna zawiera hasło
                        if (storedPassword != data.Password)
                        {
                            // Hasło nie pasuje
                            return Unauthorized(new { Message = "Invalid Password" });
                        }

                        // Pobranie roli użytkownika
                        var userRole = reader.GetString(2); // Trzecia kolumna zawiera rolę

                        // Wygenerowanie tokenu JWT
                        var token = GenerateJwtToken(data.Login, userRole);
                        return Ok(new { Message = "Login successful", Token = token });
                    }
                }
            }
            catch (Exception ex)
            {
                // Obsługa błędów
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                _connection.Close();
            }
        }

        private string GenerateJwtToken(string username, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("YourSuperSecretKey");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(12),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}

    public class LoginData
    {
    public string Login { get; set; }
    public string Password { get; set; }
}
