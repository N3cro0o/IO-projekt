using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;
using IO.Server.Elements; // Twój namespace z klasą User

namespace IO.Server.Controllers
{
    [Route("api/[controller]")]
    public class RegistrationController : Controller
    {
        private readonly AppDbContext _context;
        1
        public RegistrationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterData data)
        {
            // Sprawdzenie czy wszystkie dane są poprawne
            if (string.IsNullOrEmpty(data.Username) || string.IsNullOrEmpty(data.Password) || string.IsNullOrEmpty(data.Email))
                return BadRequest("Wszystkie pola są wymagane.");

            // Walidacja hasła
            if (data.Password.Length < 8 || !data.Password.Any(char.IsUpper) || !data.Password.Any(c => !char.IsLetterOrDigit(c)))
                return BadRequest("Hasło musi mieć co najmniej 8 znaków, 1 dużą literę i 1 znak specjalny.");

            // Sprawdzenie, czy użytkownik z takim emailem już istnieje
            if (_context.Users.Any(u => u.Email == data.Email))
                return Conflict("Użytkownik o tym emailu już istnieje.");

            // Hashowanie hasła
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(data.Password);

            // Tworzenie nowego użytkownika
            var user = new User
            {
                Login = data.Username,
                Password = hashedPassword,
                Email = data.Email,
                FirstName = data.FirstName,
                LastName = data.LastName,
                UserRole = "uczen" // Domyślnie przypisujemy rolę "User", możesz zmienić w zależności od potrzeby
            };

            // Zapis do bazy danych
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Rejestracja zakończona pomyślnie" });
        }
    }
}
