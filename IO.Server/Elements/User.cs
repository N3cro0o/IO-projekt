using System.Diagnostics;
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

        string[] names = { "Staszek", "Mathew" , "Franio", "Domino", "Karol"};

        int ID { get; set; }

        string Login { get; set; }

        string Password { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        string Email { get; set; }

        public TYPE UserType { get; set; } = TYPE.Guest;

        List<int> Courses { get; set; } = new List<int>();

        public User(int id, string login, string pass, string email, string fName, string lName, TYPE type = TYPE.Guest)
        {
            ID = id;
            Login = login;
            Password = pass;
            Email = email;
            FirstName = fName;
            LastName = lName;
            UserType = type;
        }

        public User()
        {
            Random rng = new Random();
            int lSize = 8;
            int pSize = 10;
            string login = "";
            string password = "";

            for (int i = 0; i < lSize; i++)
            {
                login += Convert.ToChar(rng.Next(0, 26) + 65);
            }
            for (int i = 0; i < pSize; i++)
            {
                password += Convert.ToChar(rng.Next(0, 26) + 65);
            }

            ID = rng.Next();
            Login = login;
            Password = password;
            Email = login + "@" + password + ".com";
            FirstName = names[rng.Next(0, 5)];
            LastName = names[rng.Next(0, 5)];
            UserType = TYPE.Guest;
        }

        public void SetID(int id)
        {
            ID = id;
        }

        public Dictionary<string, string> Dictionary()
        {
            var s = new Dictionary<string, string>();
            s.Add("id", ID.ToString());
            s.Add("login", Login);
            s.Add("password", Password);
            s.Add("userType", UserType.ToString());
            s.Add("firstName", FirstName);
            s.Add("lastName", LastName);
            s.Add("email", Email);
            return s;
        }

        public bool CorrectLoginData(string login, string pass)
        {
            if (login != Login || pass != Password)
                return false;
            return true;
        }
    }
}