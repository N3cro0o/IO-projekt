using IO.Server.Elements;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Collections.Generic;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AddCourseController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public AddCourseController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        // POST: api/AddCourse/addCourse
        [HttpPost("addCourse")]
        public ActionResult AddCourse([FromBody] AddCourse course)
        {
            try
            {
                _connection.Open();

                // Insert the new course into the database
                string query = "INSERT INTO \"Course\" (name, category, description, ownerid) VALUES (@name, @category, @description, @ownerid)";

                using (var command = new NpgsqlCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@name", course.Name);
                    command.Parameters.AddWithValue("@category", course.Category);
                    command.Parameters.AddWithValue("@description", course.Description);
                    command.Parameters.AddWithValue("@ownerid", course.OwnerId);

                    // Execute the query
                    int rowsAffected = command.ExecuteNonQuery();

                    // Check if a course was added successfully
                    if (rowsAffected > 0)
                    {
                        return Ok(new { message = "Course created successfully." });
                    }
                    else
                    {
                        return BadRequest(new { message = "Failed to create the course." });
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "An error occurred while creating the course.", details = ex.Message });
            }
            finally
            {
                // Ensure the connection is closed
                if (_connection.State == System.Data.ConnectionState.Open)
                {
                    _connection.Close();
                }
            }
        }
    }

    // Define the Course model class for the course input
    public class AddCourse
    {
        public string Name { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
        public int OwnerId { get; set; }
    }
}
