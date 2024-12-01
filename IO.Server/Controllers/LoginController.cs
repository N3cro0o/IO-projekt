using System.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IO.Server.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        // POST: HomeController/Create
        [HttpPost("loginRequest")]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        
    }
}
