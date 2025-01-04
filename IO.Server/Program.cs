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
            // Konfiguracja �rodowiska (opcjonalnie)
            EnvSetup();

            // Wydrukowanie liczby u�ytkownik�w w konsoli
            Debug.Print("User count " + Environment.Users.Count.ToString());

            // Tworzenie buildera aplikacji
            var builder = WebApplication.CreateBuilder(args);

            // Rejestracja po��czenia z baz� danych PostgreSQL w DI
            builder.Services.AddScoped<NpgsqlConnection>(provider =>
            {
                // Connection string do bazy danych PostgreSQL
                var connectionString = "Host=localhost;Port=5433;Username=postgres;Password=12345;Database=TesatyWiezy";
                return new NpgsqlConnection(connectionString);
            });

            // Konfiguracja CORS (AllowAll)
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin() // Pozw�l na dowolne �r�d�o
                          .AllowAnyMethod()   // Pozw�l na dowoln� metod� HTTP (GET, POST, DELETE, itd.)
                          .AllowAnyHeader();  // Pozw�l na dowolne nag��wki
                });
            });

            // Dodanie innych serwis�w
            builder.Services.AddControllers(); // Rejestracja kontroler�w
            builder.Services.AddOpenApi(); // Dodanie wsparcia dla OpenAPI (Swagger)

            // Budowanie aplikacji
            var app = builder.Build();

            // Mapowanie plik�w statycznych
            app.UseDefaultFiles();
            app.MapStaticAssets();

            // W��czenie OpenAPI w trybie deweloperskim
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            // W��czenie CORS dla aplikacji
            app.UseCors("AllowAll");

            // W��czenie HTTPS redirection oraz autoryzacji
            app.UseHttpsRedirection();
            app.UseAuthorization();

            // Mapowanie kontroler�w
            app.MapControllers();

            // Fallback do pliku index.html
            app.MapFallbackToFile("/index.html");

            // Uruchomienie aplikacji
            app.Run();
        }

        // Metoda konfiguruj�ca dane testowe (opcjonalnie)
        private static void EnvSetup()
        {
            // Dodanie u�ytkownik�w
            Environment.Users.Add(new User(0, "Admin", "*******", "test@email.com", "Admin", "Main", "Admin"));
            for (int i = 0; i < 11; i++)
            {
                var user = new User();
                user.SetID(i + 1);
                Environment.Users.Add(user);
            }

            // Dodanie kurs�w
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
