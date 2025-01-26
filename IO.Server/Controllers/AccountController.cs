using IO.Server.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;
using System.Text.RegularExpressions;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public AccountController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpGet("showData/{userId}")]
        public ActionResult<UserData> GetUserData(int userId)
        {
            try
            {
                _connection.Open();
                string query = "SELECT userid, login, name, surname, email, role FROM \"User\" WHERE userid = @userId";

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@userId", userId);

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var userData = new UserData
                            {
                                UserId = reader.GetInt32(0),
                                Login = reader.GetString(1),
                                Name = reader.GetString(2),
                                Surname = reader.GetString(3),
                                Email = reader.GetString(4),
                                Role = reader.GetString(5)
                            };

                            return Ok(userData);
                        }
                        else
                        {
                            return NotFound(new { message = "User not found." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "An error occurred while fetching user data.", details = ex.Message });
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                {
                    _connection.Close();
                }
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
            string query = "SELECT COUNT(*) FROM \"User\" WHERE email = @Email";
            using (var command = new NpgsqlCommand(query, _connection))
            {
                command.Parameters.AddWithValue("@Email", email);
                _connection.Open();
                var result = command.ExecuteScalar();
                _connection.Close();
                return (long)result == 0;
            }
        }

        private bool IsValidEmailFormat(string email)
        {
            // Sprawdzenie formatu e-maila za pomocą wyrażenia regularnego
            var regex = new Regex(@"^[^\s@]+@[^\s@]+\.[^\s@]+$");
            return regex.IsMatch(email);
        }

        [HttpPut("updateField/{userId}")]
        public IActionResult UpdateField(int userId, [FromBody] UpdateFieldRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.FieldName) || string.IsNullOrEmpty(request.Value))
                {
                    return BadRequest(new { message = "Invalid request data." });
                }

                // Lista dozwolonych pól
                var validFields = new[] { "login", "email", "name", "surname" };
                if (!validFields.Contains(request.FieldName))
                {
                    return BadRequest(new { message = "Invalid field name." });
                }

                // Walidacja na podstawie pola
                if (request.FieldName == "login")
                {
                    if (!IsUniqueLogin(request.Value))
                    {
                        return BadRequest(new { message = "Login is already taken." });
                    }
                }
                else if (request.FieldName == "email")
                {
                    if (!IsValidEmailFormat(request.Value))
                    {
                        return BadRequest(new { message = "Invalid email format." });
                    }

                    if (!IsUniqueEmail(request.Value))
                    {
                        return BadRequest(new { message = "Email is already taken." });
                    }
                }



                string query = $"UPDATE \"User\" SET \"{request.FieldName}\" = @Value WHERE userid = @UserId";

                _connection.Open();
                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@Value", request.Value);
                    command.Parameters.AddWithValue("@UserId", userId);

                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Ok(new { message = "Field updated successfully." });
                    }
                    else
                    {
                        return NotFound(new { message = "User not found." });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", details = ex.Message });
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                {
                    _connection.Close();
                }
            }
        }

        [HttpPut("changePassword/{userId}")]
        public IActionResult ChangePassword(int userId, [FromBody] ChangePasswordRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.OldPassword) || string.IsNullOrEmpty(request.NewPassword))
                {
                    return BadRequest(new { message = "Password data is required." });
                }

                // Walidacja nowego hasła
                if (!IsValidPassword(request.NewPassword))
                {
                    return BadRequest(new { message = "New password must be at least 8 characters long, contain at least one uppercase letter, one special character, and no spaces." });
                }

                string query = "SELECT password FROM \"User\" WHERE userid = @UserId";

                _connection.Open();
                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@UserId", userId);
                    var storedPassword = command.ExecuteScalar()?.ToString();

                    // Sprawdzenie poprawności starego hasła
                    if (storedPassword == null || !VerifyPassword(request.OldPassword, storedPassword))
                    {
                        return Unauthorized(new { message = "Old password is incorrect." });
                    }

                    // Haszowanie nowego hasła
                    string hashedPassword = PasswordHasher.HashPasswordWithSHA256(request.NewPassword);

                    string updateQuery = "UPDATE \"User\" SET password = @Password WHERE userid = @UserId";

                    using (var updateCommand = new NpgsqlCommand(updateQuery, _connection))
                    {
                        updateCommand.Parameters.AddWithValue("@Password", hashedPassword);
                        updateCommand.Parameters.AddWithValue("@UserId", userId);

                        int rowsAffected = updateCommand.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return Ok(new { message = "Password updated successfully." });
                        }
                        else
                        {
                            return NotFound(new { message = "User not found." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", details = ex.Message });
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                {
                    _connection.Close();
                }
            }
        }

        private bool IsValidPassword(string password)
        {
            if (password.Length < 8)
                return false;

            // Minimum 1 wielka litera, 1 znak specjalny, 8 znaków
            var regex = new Regex(@"^(?=.*[A-Z])(?=.*[\W_]).{8,}$");
            return regex.IsMatch(password);
        }

        private bool VerifyPassword(string enteredPassword, string storedHashedPassword)
        {
            // Porównanie hasła wprowadzonego z zahaszowanym (można dodać więcej logiki np. dla innego haszowania)
            string hashedEnteredPassword = PasswordHasher.HashPasswordWithSHA256(enteredPassword);
            return hashedEnteredPassword == storedHashedPassword;
        }

        public class ChangePasswordRequest
        {
            public string OldPassword { get; set; }
            public string NewPassword { get; set; }
        }
        public class UpdateFieldRequest
        {
            public string FieldName { get; set; }
            public string Value { get; set; }
        }

        public class UserData
        {
            public int UserId { get; set; }
            public string Login { get; set; }
            public string Name { get; set; }
            public string Surname { get; set; }
            public string Email { get; set; }
            public string Role { get; set; }
        }
    }
}
