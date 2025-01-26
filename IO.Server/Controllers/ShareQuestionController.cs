using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Collections.Generic;

namespace IO.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShareQuestionController : ControllerBase
    {
        private readonly NpgsqlConnection _connection;

        public ShareQuestionController(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        [HttpPost]
        public IActionResult ShareQuestions([FromBody] ShareRequest request)
        {
            if (request == null || request.QuestionIds == null || request.QuestionIds.Count == 0)
            {
                return BadRequest("Invalid request data.");
            }

            try
            {
                _connection.Open();

                foreach (var questionId in request.QuestionIds)
                {
                    string updateQuery = "UPDATE \"Question\" SET shared = TRUE WHERE questionid = @questionId";
                    using (var command = new NpgsqlCommand(updateQuery, _connection))
                    {
                        command.Parameters.AddWithValue("questionId", questionId);
                        command.ExecuteNonQuery();
                    }
                }

                return Ok(new { Message = "Questions shared successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                _connection.Close();
            }
        }

        public class ShareRequest
        {
            public List<int> QuestionIds { get; set; }
        }
    }
}