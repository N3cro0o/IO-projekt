using System.Numerics;

namespace IO.Server.Elements
{
    public class Result
    {
        int Course { get; set; }

        int Test { get; set; }

        List<Answer> Answers = new List<Answer>();

        int ID { get; set; }
    }
}
