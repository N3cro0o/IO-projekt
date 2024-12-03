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
        public IEnumerable<User> GetUsers()
        {
            return Environment.Users;
        }

        [HttpGet("getEnvCourses")]
        public IEnumerable<Course> GetCourses()
        {
            return Environment.Courses;
        }
    }
}
