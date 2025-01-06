using System.Text.Json.Serialization;
using static IO.Server.Elements.Question;

namespace IO.Server.Elements
{
    public class Question
    {
        // This is a question class
        public enum QUESTION_TYPE
        {
            Closed,
            Open
        }

        [JsonInclude]
        string Text = "";

        [JsonInclude]
        QUESTION_TYPE QuestionType {  get; set; }

        [JsonInclude]
        List<string> Answers = new List<string>();

        [JsonInclude]
        int Points { get; set; }

        [JsonInclude]
        List<int> CorrectAnswers = new List<int>();

        [JsonInclude]
        int ID;
        
        public Question(int id, string text, QUESTION_TYPE type, List<string> answ, int points, List<int> corrAnsw)
        {
            ID = id;
            Text = text;
            QuestionType = type;
            Answers = answ;
            CorrectAnswers = corrAnsw;
            Points = points;
        }

        public void ModifyAnswers(List<string> answ)
        {
            Answers = answ;
        }

        public void ModifyQuestion(string text)
        {
            Text = text;
        }
        
        public void ModifyPoints(int points)
        {
            Points = points;
        }

        public string ReturnQuestion()
        {
            return Text;
        }

        public QUESTION_TYPE Type()
        {
            return QuestionType;
        }

        public int ReturnPoints()
        {
            return Points;
        }
    }
}
