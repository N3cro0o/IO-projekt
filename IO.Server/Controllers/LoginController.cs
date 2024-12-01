using System.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using IO.Server.Elements;
using Azure.Core;

namespace IO.Server.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        [HttpPost("loginRequest")]
        public ActionResult Create([FromBody] LoginData data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (data.Username == "testLogin" && data.Password == "1234")
            {
                return Ok(new { Message = "Login successful" });
            }
            else
            {
                return Unauthorized(new { Message = "Invalid Username or Password" });
            }
        }
    }
}
