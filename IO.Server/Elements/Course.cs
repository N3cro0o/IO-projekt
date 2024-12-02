namespace IO.Server.Elements
{
    public class Course
    {
        public string? Name { get; set; }

        int ID { get; set; }

        public List<int> Teachers { get; set; } = new List<int>();

        public List<int> Students { get; set; } = new List<int>(); 

        public List<int> Tests { get; set; } = new List<int>(); 

        public List<int> Results { get; set; } = new List<int>(); 

        public Course(int id, string name, List<int> teachers, List<int> students, List<int> tests)
        {
            ID = id;
            Name = name;
            Teachers = teachers;
            Students = students;
            Tests = tests;

            // Update roles
            TeacherUpdate();
            StudentUpdate();
        }

        void TeacherUpdate()
        {
            foreach (int t in Teachers)
            {
                var user = Environment.Users[t];
                if (user.UserType == User.TYPE.Admin)
                    continue;
                user.UserType = User.TYPE.Teacher;
            }
        }

        void StudentUpdate()
        {
            foreach (int t in Students)
            {
                var user = Environment.Users[t];
                if (user.UserType == User.TYPE.Admin || user.UserType == User.TYPE.Teacher)
                    continue;
                Environment.Users[t].UserType = User.TYPE.Student;
            }
        }
    }
}
