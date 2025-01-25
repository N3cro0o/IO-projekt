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
                return BadRequest("Dane nie mogą być puste");
            }

            // Walidacja unikalności loginu
            if (!IsUniqueLogin(data.Login))
            {
                return BadRequest("Login jest już zajęty");
            }

            // Walidacja unikalności e-maila
            if (!IsUniqueEmail(data.Email))
            {
                return BadRequest("Adres e-mail jest już zajęty");
            }

            // Walidacja hasła
            if (!IsValidPassword(data.PasswordHash))
            {
                return BadRequest("Hasło musi zawierać co najmniej 8 znaków, jedną dużą literę i jeden znak specjalny");
            }

            //var hashedPassword = BCrypt.Net.BCrypt.HashPassword(data.PasswordHash);
            var hashedPassword = PasswordHasher.HashPasswordWithSHA256(data.PasswordHash);

            //// Wyświetlenie danych w logu serwera
            //Console.WriteLine($"Login: {data.Login}");
            //Console.WriteLine($"First Name: {data.FirstName}");
            //Console.WriteLine($"Last Name: {data.LastName}");
            //Console.WriteLine($"Email: {data.Email}");
            //Console.WriteLine($"Password (hashed): {data.PasswordHash}");

            //// Zwrot danych jako odpowiedź
            //return Ok(new
            //{
            //    Message = "Dane odebrane pomyślnie",
            //    ReceivedData = data
            //});

            string role = "uczen";
            string query = "INSERT INTO \"User\"(login, name, surname, email, password, role) VALUES ";
            query += string.Format("(\'{0}\', \'{1}\', \'{2}\', \'{3}\', \'{4}\', \'{5}\')", data.Login, data.FirstName, data.LastName, data.Email, hashedPassword, role);
            Debug.Print(query);
            try
            {
                _connection.Open();
                using NpgsqlCommand npgsqlCommand = new NpgsqlCommand(query, _connection);
                npgsqlCommand.ExecuteNonQuery();
                return Ok(new { Message = "Rejestracja zakończona sukcesem" });
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