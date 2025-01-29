using System.Numerics;

namespace IO.Server.Elements
{
    public class Result
    {
        int Course { get; set; }

        int TestID { get; set; }

        public List<Answer> Answers = new List<Answer>();

        int ID { get; set; }

        public Result(int id, int course, int test, List<Answer> answs)
        {
            ID = id;
            Course = course;
            TestID = test;
            Answers = answs;
        }

        public int ReturnTestID()
        {
            return TestID;
        }
    }
}
