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
            // Tworzenie buildera aplikacji
            var builder = WebApplication.CreateBuilder(args);

            // Rejestracja po³¹czenia z baz¹ danych PostgreSQL w DI
            builder.Services.AddScoped<NpgsqlConnection>(provider =>
            {
                // Connection string do bazy danych PostgreSQL
                var connectionString = "Host=localhost; Port=5432; Database=TesatyWiezyV2; User Id=postgres; Password=admin;";
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


        


    }
}
