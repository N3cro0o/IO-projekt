namespace IO.Server.Elements
{
    public class Report
    {
        List<int> results { get; set; } = new List<int>();
        List<int> PassedUsers { get; set; } = new List<int>();
        List<int> FailedUsers { get; set; } = new List<int>();

        public List<User> ReturnPassed()
        {
            List<User> result = new List<User>();
            foreach (int i in PassedUsers)
            {
                result.Add(Environment.Users[i]);
            }
            return result;
        }

        public List<User> ReturnFailed()
        {
            List<User> result = new List<User>();
            foreach (int i in FailedUsers)
            {
                result.Add(Environment.Users[i]);
            }
            return result;
        }

        public List<Result> ReturnResult()
        {
            return new List<Result>();
        }

        public double ReturnMeanGrade()
        {
            return 0;
        }

        public User[]? ReturnWorstBestStudent()
        {
            User[]? usArr = null;
            return usArr;
        }
    } 
}
