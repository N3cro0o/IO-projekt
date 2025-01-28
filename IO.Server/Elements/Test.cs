using System.Text.Json.Serialization;

namespace IO.Server.Elements
{
    public class Test
    {
        [JsonInclude]
        int ID { get; set; }

        [JsonInclude]
        List<int> Questions { get; set; } = new List<int>();

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int Category { get; set; }

        [JsonInclude]
        List<Answer> Answers { get; set; } = new List<Answer>();

        [JsonInclude]
        int Course { get; set; }
        
        int CurrentQuestion = 0;

        public Test(int id, List<int> quest, DateTime start, DateTime end, int cat)
        {
            ID = id;
            Questions = quest;
            StartDate = start;
            EndDate = end;
            Category = cat;
        }
        
        public Test()
        {
        }

        public List<Question> ReturnQuestions()
        {
            List<Question> q = new List<Question>();
            foreach( var i in Questions)
            {
                q.Add(Environment.QuestionPool[i]);
            }
            return q;
        }

        // Returns empty list when out of questions
        public List<Question> NextQuestion()
        {
            List<Question> q = new List<Question>();
            if (Questions.Count == CurrentQuestion)
            {
                return q;
            }
            q.Add(Environment.QuestionPool[Questions[CurrentQuestion]]);
            CurrentQuestion++;
            return q;
        }

        public void FinishTest() { }

        public int MaxPoints()
        {
            
            return 2137;
        }

        public void ChangeCategory(int cat)
        {
            Category = cat;
        }

        public int ReturnID()
        {
            return ID;
        }

        public Answer AddAnswer(Question.QUESTION_TYPE type, string answ, int userID)
        {
            var answer = new Answer()
            {
                Course = this.Course,
                User = userID,
                UserAnswer = answ,
                Test = ID,
                Type = type
            };

            Answers.Add(answer);
            return answer;
        }
    }
}
