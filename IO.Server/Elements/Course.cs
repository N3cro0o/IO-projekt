using System.Text.Json.Serialization;

namespace IO.Server.Elements
{
    public class Course
    {
        public string? Name { get; set; }

        int ID { get; set; }

        [JsonInclude]
        List<int> Teachers { get; set; } = new List<int>();

        [JsonInclude]
        List<int> Students { get; set; } = new List<int>();

        [JsonInclude]
        List<int> Tests { get; set; } = new List<int>();

        [JsonInclude]
        List<int> Results { get; set; } = new List<int>();
        
        [JsonInclude]
        int Category { get; set; }


        public Course(int id, string name, int cat, List<int> teachers, List<int> students, List<int> tests)
        {
            ID = id;
            Name = name;
            Teachers = teachers;
            Category = cat;
            Students = students;
            Tests = tests;
        }

     
        public List<User> ShowTeachers()
        {
            List<User> users = new List<User>();
            foreach (int i in Teachers)
            {
                users.Add(Environment.Users[i]);
            }
            return users;
        }

        public List<User> ShowStudents()
        {
            List<User> users = new List<User>();
            foreach (int i in Students)
            {
                users.Add(Environment.Users[i]);
            }
            return users;
        }

        public void AddStudent(int id)
        {
            Students.Add(id);
        }

        public void AddTeacher(int id)
        {
            Teachers.Add(id);
        }

        public bool RemoveStudent(int id)
        {
            if (Students.Count == 1)
            {
                return false;
            }

            foreach (var num in Students)
            {
                if (num == id)
                {
                    Students.Remove(num);
                    return true;
                }
            }
            return false;
        }

        public bool RemoveTeacher(int id)
        {
            if (Teachers.Count == 1)
            {
                return false;
            }

            foreach (var num in Teachers)
            {
                if (num == id)
                {
                    Teachers.Remove(num);
                    return true;
                }
            }
            return false;
        }

        public int ReturnCategory()
        {
            return Category;
        }
    }
}
