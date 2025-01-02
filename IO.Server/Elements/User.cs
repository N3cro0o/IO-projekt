using System.Diagnostics;
using System.Numerics;
using System.Text.Json.Serialization;

namespace IO.Server.Elements
{

    public class User
    {
        public enum TYPE
        {
            gosc = 0,
            uczen = 1,
            nauczyciel = 2,
            admin = 10,
        }

        [JsonInclude]
        int ID { get; set; }

        [JsonInclude]
        string Login { get; set; }

        [JsonInclude]
        string Password { get; set; }

        [JsonInclude]
        public string FirstName { get; set; }

        public string LastName { get; set; }

        [JsonInclude]
        string Email { get; set; }

        public string UserRole { get; set; }

        [JsonInclude]
        List<int> Courses { get; set; } = new List<int>();

        string Token { get; set; } = "";

        public User(int id, string login, string pass, string email, string fName, string lName, string role)
        {
            ID = id;
            Login = login;
            Password = pass;
            Email = email;
            FirstName = fName;
            LastName = lName;
            UserRole = role;
        }

        public User() {}

        public void SetID(int id)
        {
            ID = id;
        }

        public bool CorrectLoginData(string login, string pass)
        {
            if (login != Login || pass != Password)
                return false;
            return true;
        }

        public void SetToken(string token)
        {
            if (token != null) 
                Token = token;
        }
    }
}