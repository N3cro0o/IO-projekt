using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    private readonly AppDbContext _context;

    public LoginController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("loginRequest")]
    public async Task<IActionResult> Login([FromBody] LoginData data)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Wyszukiwanie użytkownika po loginie lub emailu
        var user = await _context.Users.FirstOrDefaultAsync(u =>
                (u.Login == data.Username || u.Email == data.Username) &&
                u.Password == data.Password);

        if (user == null)
        {
            return Unauthorized(new { Message = "Invalid username or password" });
        }

        // Generowanie tokenu JWT
        var token = GenerateJwtToken(user.Login, user.Role);

        return Ok(new { Message = "Login successful", Token = token });
    }

    private string GenerateJwtToken(string username, string role)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes("YourSecretKeyHere");

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role)
            }),
            Expires = DateTime.UtcNow.AddHours(12),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}