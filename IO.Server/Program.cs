using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using IO.Server.Elements;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using Npgsql.EntityFrameworkCore.PostgreSQL;


namespace IO.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {

            // Konfiguracja rodowiska (opcjonalnie)
            EnvSetup();

            // Wydrukowanie liczby u¿ytkowników w konsoli


            Debug.Print("User count " + Environment.Users.Count.ToString());

            // Tworzenie buildera aplikacji
            var builder = WebApplication.CreateBuilder(args);

            // Rejestracja po³¹czenia z baz¹ danych PostgreSQL w DI
            builder.Services.AddScoped<NpgsqlConnection>(provider =>
            {
                // Connection string do bazy danych PostgreSQL
                var connectionString = "Host=localhost; Port = 5432; Database = TesatWiezy; User Id = postgres; Password = 12345;";
                return new NpgsqlConnection(connectionString);
            });

            // Konfiguracja CORS (AllowAll)


            builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

            // Konfiguracja CORS

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin() // Pozwól na dowolne ród³o
                          .AllowAnyMethod()   // Pozwól na dowoln¹ metodê HTTP (GET, POST, DELETE, itd.)
                          .AllowAnyHeader();  // Pozwól na dowolne nag³ówki
                });
            });

            // Dodanie innych serwisów
            builder.Services.AddControllers(); // Rejestracja kontrolerów
            builder.Services.AddOpenApi(); // Dodanie wsparcia dla OpenAPI (Swagger)

            // Budowanie aplikacji
            var app = builder.Build();

            // Mapowanie plików statycznych
            app.UseDefaultFiles();
            app.MapStaticAssets();

            // W³¹czenie OpenAPI w trybie deweloperskim
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            // W³¹czenie CORS dla aplikacji
            app.UseCors("AllowAll");

            // W³¹czenie HTTPS redirection oraz autoryzacji
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();

            // Mapowanie kontrolerów
            app.MapControllers();

            // Fallback do pliku index.html
            app.MapFallbackToFile("/index.html");

            // Uruchomienie aplikacji
            app.Run();
        }


        // Metoda konfiguruj¹ca dane testowe (opcjonalnie)
        private static void EnvSetup()
        {
            // Dodanie u¿ytkowników
            Environment.Users.Add(new User(0, "Admin", "*******", "test@email.com", "Admin", "Main", "Admin"));
            for (int i = 0; i < 11; i++)
            {
                var user = new User();
                user.SetID(i + 1);
                Environment.Users.Add(user);
            }

            // Dodanie kursów
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
