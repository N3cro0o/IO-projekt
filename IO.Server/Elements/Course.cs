namespace IO.Server.Elements
{
    public class Course
    {
        public string? Name { get; set; }

        int ID { get; set; }

        private int[] TeachArr { get; set; } = new int[0]; // Teacher vec

        public Course(int id)
        {
            ID = id;
        }
    }
}
