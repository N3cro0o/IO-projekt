namespace IO.Server.Elements
{
    public class Question
    {
        string? Text;

        int Type {  get; set; }

        List<string> Answers = new List<string>();
        
        int Points { get; set; }

        List<int> CorrectAnswers = new List<int>();

        int ID;
        


    }
}
