namespace IO.Server.Elements
{
    public class Course
    {
        public string? Name { get; set; }

        int ID { get; set; }

        public List<int> Teachers { get; set; } = new List<int>(); // Teacher vec

        public Course(int id)
        {
            ID = id;
        }
    }
}
