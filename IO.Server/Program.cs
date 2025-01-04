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
            Debug.Print("User count " + Environment.Users.Count.ToString());

            var builder = WebApplication.CreateBuilder(args);

            // Rejestracja po³¹czenia do bazy danych PostgreSQL w DI
            builder.Services.AddScoped<NpgsqlConnection>(provider =>
            {
                var connectionString = "Host=localhost;Port=5432;Username=postgres;Password=admin;Database=TesatyWiezy";
                return new NpgsqlConnection(connectionString);
            });


            builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

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
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
