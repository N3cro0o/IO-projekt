using System.Text.Json.Serialization;
using System.Collections.Generic;

namespace IO.Server.Elements
{
    public class User
    {
        [JsonInclude]
        public int? ID { get; set; }

        [JsonInclude]
        public string Login { get; set; }

        [JsonInclude]
        public string PasswordHash { get; set; } // Zmienione z Password na PasswordHash

        [JsonInclude]
        public string FirstName { get; set; }

        [JsonInclude]
        public string LastName { get; set; }

        [JsonInclude]
        public string Email { get; set; }

        [JsonInclude]
        public string UserRole { get; set; }

        [JsonInclude]
        public List<int> Courses { get; set; } = new List<int>();

        string Token { get; set; } = "";

        // Konstruktor z haszowanym hasłem
        public User(int? id, string login, string passwordHash, string email, string fName, string lName, string role)
        {
            ID = id;
            Login = login;
            PasswordHash = passwordHash; // Zmieniamy na hash hasła
            Email = email;
            FirstName = fName;
            LastName = lName;
            UserRole = role;
        }

        public User() { }

        public void SetID(int id)
        {
            ID = id;
        }

        // Weryfikacja hasła przy logowaniu
        //public bool VerifyPassword(string password)
        //{
        //    return BCrypt.Net.BCrypt.Verify(password, PasswordHash); // Weryfikacja hasła z hashem
        //}

        public void SetToken(string token)
        {
            if (token != null)
                Token = token;
        }
    }
}
