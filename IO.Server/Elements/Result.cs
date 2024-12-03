using System.Numerics;

namespace IO.Server.Elements
{
    public class Result
    {
        int Course { get; set; }

        int Test { get; set; }

        public List<Answer> Answers = new List<Answer>();

        int ID { get; set; }

        public Result(int id, int course, int test, List<Answer> answs)
        {
            ID = id;
            Course = course;
            Test = test;
            Answers = answs;
        }

        public User ReturnUser()
        {
            int id = Answers[0].User;
            return Environment.Users[id];
        }

        public Test ReturnTest()
        {
            return Environment.Tests[Test];
        }

        public double ReturnPercent()
        {
            int pointsMax = ReturnTest().MaxPoints();
            int points = 0;
            foreach (Answer answ in Answers)
            {
                points += answ.Points;
            }

            return (double)points / (double)pointsMax;
        }
    }
}
