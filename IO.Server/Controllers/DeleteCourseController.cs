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
                using (var connection = _connection)
                {
                    connection.Open();

                    using (var transaction = connection.BeginTransaction())
                    {
                        try
                        {
                            // Usuwanie testów przypisanych do kursu
                            string deleteTestsQuery = "DELETE FROM \"Test\" WHERE courseid = @courseid";
                            using (var deleteTestsCommand = new NpgsqlCommand(deleteTestsQuery, connection))
                            {
                                deleteTestsCommand.Parameters.AddWithValue("@courseid", request.courseid);
                                deleteTestsCommand.ExecuteNonQuery();
                            }

                            // Usuwanie kursu
                            string deleteCourseQuery = "DELETE FROM \"Course\" WHERE courseid = @courseid";
                            using (var deleteCourseCommand = new NpgsqlCommand(deleteCourseQuery, connection))
                            {
                                deleteCourseCommand.Parameters.AddWithValue("@courseid", request.courseid);
                                int rowsAffected = deleteCourseCommand.ExecuteNonQuery();

                                if (rowsAffected == 0)
                                {
                                    transaction.Rollback();
                                    return NotFound(new { message = "Course not found." });
                                }
                            }

                            transaction.Commit();
                            return Ok(new { message = "Course and associated tests deleted successfully." });
                        }
                        catch (Exception)
                        {
                            transaction.Rollback();
                            throw;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the Course.", details = ex.Message });
            }
        }
    }

    // Model requestu
    public class DeleteCourseRequest
    {
        public int courseid { get; set; }
    }
}