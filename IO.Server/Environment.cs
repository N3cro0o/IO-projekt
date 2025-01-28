using IO.Server.Elements;
namespace IO.Server
{
    static class Environment
    {
        public static List<User> Users = new List<User>();
        public static List<Course> Courses = new List<Course>();
        public static List<Question> QuestionPool = new List<Question>();
        public static List<Test> Tests { get; set; } = new List<Test>();
    }
}
