using System.Diagnostics;
using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MainController : ControllerBase
    {

        private readonly ILogger<MainController> _logger;

        public MainController(ILogger<MainController> logger)
        {
            _logger = logger;
        }

        [HttpGet("getEnvUsers")]
        public List<Dictionary<string, string>> GetUsers()
        {
            List<Dictionary<string, string>> d = new List<Dictionary<string, string>>();
            foreach (User us in Environment.Users)
            {
                d.Add(us.Dictionary());
            }
            return d;
        }

        [HttpGet("getEnvCourses")]
        public List<Dictionary<string, string>> GetCourses()
        {
            List<Dictionary<string, string>> d = new List<Dictionary<string, string>>();
            foreach (User us in Environment.Users)
            {
                d.Add(us.Dictionary());
            }
            return d;
        }
    }
}
