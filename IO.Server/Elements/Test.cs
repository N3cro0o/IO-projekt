namespace IO.Server.Elements
{
    public class Test
    {
        int ID { get; set; }

        List<int> Tests { get; set; } = new List<int>();

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int Category { get; set; }

        List<Answer> Answers { get; set; } = new List<Answer>();

        int Course { get; set; }

        public int CurrentQuestion = 0;
    }
}
