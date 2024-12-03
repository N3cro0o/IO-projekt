using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using IO.Server.Elements;
using System.Diagnostics;

namespace IO.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            EnvSetup();
            Debug.Print("User count " + Environment.Users.Count.ToString());

            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.MapStaticAssets();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }

        private static void EnvSetup()
        {
            // Users
            Environment.Users.Add(new User(0, "Admin", "*******", "test@email.com", "Admin", "Main", User.TYPE.Admin));
            for (int i = 0; i < 11; i++)
            {
                var user = new User();
                user.SetID(i + 1);
                Environment.Users.Add(user);
            }

            // Courses
            for (int i = 0; i < 3; i++)
            {
                List<int> teach = new List<int>();
                List<int> stud = new List<int>();
                teach.Add(i * 4);
                stud.Add(i * 4 + 1);
                stud.Add(i * 4 + 2);
                stud.Add(i * 4 + 3);
                var c = new Course(i, "Course no." + i.ToString(), 0, teach, stud, new List<int>());
                Environment.Courses.Add(c);
            }
        }
    }
}