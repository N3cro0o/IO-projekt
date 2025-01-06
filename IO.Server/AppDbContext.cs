using Microsoft.EntityFrameworkCore;
using IO.Server.Elements;

namespace IO.Server
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Course> Courses { get; set; } // DbSet dla tabeli "Course"
    }
}
