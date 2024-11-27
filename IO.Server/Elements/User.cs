using System.Numerics;

namespace IO.Server.Elements
{
    public class User
    {
        public enum TYPE
        {
            Guest = 0,
            Student = 1,
            Teacher = 2,
            Admin = 10,
        }

        public int ID { get; set; }

        public string? Login { get; set; }

        public string? Password { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? Email { get; set; }

        public TYPE UserType { get; set; } = TYPE.Guest;

        public List<int> Courses { get; set; } = new List<int>();

    }
}