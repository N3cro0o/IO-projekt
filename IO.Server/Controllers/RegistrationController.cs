using Microsoft.AspNetCore.Mvc;
using IO.Server.Elements;
using Npgsql;
using System.Text.RegularExpressions;
using System.Diagnostics;
using Microsoft.AspNetCore.Identity;
using System.Text;
using System.Security.Cryptography;
using IO.Server.Utilities;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public RegistrationController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] NewUser data)
        {

            if (data == null)
            {
                return BadRequest(new { Message = "Data can't be empty" });
            }

            // Walidacja unikalności loginu
            if (!IsUniqueLogin(data.Login))
            {
                return BadRequest(new { Message = "Login already in use" });
            }

            // Walidacja unikalności e-maila
            if (!IsUniqueEmail(data.Email))
            {
                return BadRequest(new { Message = "Email already in use" });
            }

            // Walidacja hasła
            if (!IsValidPassword(data.PasswordHash))
            {
                return BadRequest(new { Message = "Password should have 8 letters, 1 big letter and special character" });
            }

            //var hashedPassword = BCrypt.Net.BCrypt.HashPassword(data.PasswordHash);
            var hashedPassword = PasswordHasher.HashPasswordWithSHA256(data.PasswordHash);

            string role = "student";
            string query = "INSERT INTO \"User\"(login, name, surname, email, password, role) VALUES ";
            query += string.Format("(\'{0}\', \'{1}\', \'{2}\', \'{3}\', \'{4}\', \'{5}\')", data.Login, data.FirstName, data.LastName, data.Email, hashedPassword, role);
            Debug.Print(query);
            try
            {
                _connection.Open();
                using NpgsqlCommand npgsqlCommand = new NpgsqlCommand(query, _connection);
                npgsqlCommand.ExecuteNonQuery();
                return Ok(new { Message = "Registration ended successfully" });
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

        private bool IsUniqueLogin(string login)
        {
            string query = "SELECT COUNT(*) FROM \"User\" WHERE login = @login";
            using (var command = new NpgsqlCommand(query, _connection))
            {
                command.Parameters.AddWithValue("@login", login);
                _connection.Open();
                var result = command.ExecuteScalar();
                _connection.Close();
                return (long)result == 0;
            }
        }

        private bool IsUniqueEmail(string email)
        {
            string query = "SELECT COUNT(*) FROM \"User\" WHERE email = @email";
            using (var command = new NpgsqlCommand(query, _connection))
            {
                command.Parameters.AddWithValue("@email", email);
                _connection.Open();
                var result = command.ExecuteScalar();
                _connection.Close();
                return (long)result == 0;
            }
        }

        private bool IsValidPassword(string password)
        {
            if (password.Length < 8)
                return false;

            // Minimum 1 uppercase letter, 1 special character, and 8 characters
            var regex = new Regex(@"^(?=.*[A-Z])(?=.*[\W_]).{8,}$");
            return regex.IsMatch(password);
        }

       
        }
    }

public class NewUser
{
    public string Login { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
}


namespace IO.Server.Utilities
{
    public static class PasswordHasher
    {
        public static string HashPasswordWithSHA256(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = Encoding.UTF8.GetBytes(password);
                byte[] hash = sha256.ComputeHash(bytes);

                StringBuilder builder = new StringBuilder();
                foreach (byte b in hash)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}