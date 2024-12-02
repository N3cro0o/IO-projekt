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

        [HttpGet]
        public IEnumerable<User> Get()
        {
            var rng = new Random();

            return Enumerable.Range(1, 5).Select(index => new User
            {
                ID = index,
                Login = "login" + index.ToString(),
                Password = "1234",
                LastName = "Doe",
                Email = index.ToString() + "@wp.pl",
                FirstName = "Domino",
                Courses = [rng.Next(10), rng.Next(10), rng.Next(10), rng.Next(10),],
                UserType = (IO.Server.Elements.User.TYPE)rng.Next(3)
            })
            .ToArray();
        }
    }
}
