using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeleteCourseController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public DeleteCourseController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpDelete("deleteCourse")]
        public IActionResult DeleteCourse([FromBody] DeleteCourseRequest request)
        {
            if (request == null || request.courseid <= 0)
            {
                return BadRequest(new { message = "Invalid course ID." });
            }

            try
            {
                // Zapytanie SQL
                string query = "DELETE FROM \"Course\" WHERE courseid = @courseid";

                using (var connection = _connection)
                {
                    connection.Open();
                    using (var command = new NpgsqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@courseid", request.courseid); // Przypisanie parametru
                        int rowsAffected = command.ExecuteNonQuery();

                        if (rowsAffected == 0)
                        {
                            return NotFound(new { message = "Course not found." });
                        }
                    }
                }

                return Ok(new { message = "Course deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the course.", details = ex.Message });
            }
        }
    }

    // Model requestu
    public class DeleteCourseRequest
    {
        public int courseid { get; set; }
    }
}
