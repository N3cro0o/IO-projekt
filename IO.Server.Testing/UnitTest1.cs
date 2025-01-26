using System;
using IO.Server.Controllers;
using IO.Server.Elements;
using Npgsql;
using Xunit; 

namespace IO.Server.Testing
{
    public class UnitTest1
    {
        [Fact]
        public void UserDataBaseCheck()
        {
            // Connection string do bazy danych
            string connectionString = "Host=localhost;Port=5432;Username=postgres;Password=admin;Database=TesatyWiezy";
            var connection = new NpgsqlConnection(connectionString);
            var controller = new LoginController(connection);
            var data = new LoginData()
            {
                Login = "Admin",
                Password = "*******"
            };
            var state = controller.Login(data);
            Assert.True(state != null);
               
        }
        [Fact]
        public void CourseDataBaseCheck()
        {
            // Connection string do bazy danych
            string connectionString = "Host=localhost;Port=5432;Username=postgres;Password=admin;Database=TesatyWiezy";
            var connection = new NpgsqlConnection(connectionString);
            var controller = new CourseController(connection);
           
            var state = controller.GetCourses();
            Assert.True(state != null);

        }
        [Fact]
        public void SetTestTimeDataBaseCheck()
        {
            // Connection string do bazy danych
            string connectionString = "Host=localhost;Port=5432;Username=postgres;Password=admin;Database=TesatyWiezy";
            var connection = new NpgsqlConnection(connectionString);
            var controller = new SetTestTimeController(connection);
            var data = new TestTimeUpdateRequest()
            {
                StartTime = DateTime.Now,
                EndTime = DateTime.Now.AddDays(5)
            };

            var state = controller.UpdateTestTime(11, data);
            Assert.True(state != null);

        }

        [Fact]
        public void AddCourseDataBaseCheck()
        {
            // Connection string do bazy danych
            string connectionString = "Host=localhost;Port=5432;Username=postgres;Password=admin;Database=TesatyWiezy";
            var connection = new NpgsqlConnection(connectionString);
            var controller = new AddCourseController(connection);
            var data = new AddCourse()
            {
                Name = "siema",
                Category = "leh",
                Description = "ajj",
                OwnerId = 5
            };

            var state = controller.AddCourse(data);
            Assert.True(state != null);

        }


        [Fact]
        public void DeleteTestDataBaseCheck()
        {
            // Connection string do bazy danych
            string connectionString = "Host=localhost;Port=5432;Username=postgres;Password=admin;Database=TesatyWiezy";
            var connection = new NpgsqlConnection(connectionString);
            var controller = new DeleteTestController(connection);
           

            var state = controller.DeleteTest(1);
            Assert.True(state != null);

        }

        [Fact]
        public void StartTestDataBaseCheck()
        {
            // Connection string do bazy danych
            string connectionString = "Host=localhost;Port=5432;Username=postgres;Password=admin;Database=TesatyWiezy";
            var connection = new NpgsqlConnection(connectionString);
            var controller = new StartTestController(connection);


            var state = controller.StartTest(1);
            Assert.True(state != null);

        }
    }
}
