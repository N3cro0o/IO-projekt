using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using IO.Server.Elements;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace IO.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            EnvSetup();
            Debug.Print("User count " + Environment.Users.Count.ToString());

            var builder = WebApplication.CreateBuilder(args);

            // Rejestracja po³¹czenia do bazy danych PostgreSQL w DI
            builder.Services.AddScoped<NpgsqlConnection>(provider =>
            {
                var connectionString = "Host=localhost;Port=5433;Username=postgres;Password=12345;Database=TesatyWiezy";
                return new NpgsqlConnection(connectionString);
            });

            // Konfiguracja CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            // Inne serwisy
            builder.Services.AddControllers();
            builder.Services.AddOpenApi();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.MapStaticAssets();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            // W³¹czenie CORS
            app.UseCors("AllowAll");

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();
            app.MapFallbackToFile("/index.html");

            app.Run();
        }

        private static void EnvSetup()
        {
            // Users
            Environment.Users.Add(new User(0, "Admin", "*******", "test@email.com", "Admin", "Main", "Admin"));
            for (int i = 0; i < 11; i++)
            {
                var user = new User();
                user.SetID(i + 1);
                Environment.Users.Add(user);
            }

            // Courses
            // Courses
            for (int i = 0; i < 3; i++)
            {
                List<int> teach = new List<int>();
                List<int> stud = new List<int>();
                teach.Add(i * 4);
                stud.Add(i * 4 + 1);
                stud.Add(i * 4 + 2);
                stud.Add(i * 4 + 3);

                var course = new Course(
                    id: i,
                    name: $"Course {i}",
                    cat: "General",
                    teachers: teach,
                    students: stud,
                    tests: new List<int>()
                );

                Environment.Courses.Add(course);
            }



        }
    }
    }

