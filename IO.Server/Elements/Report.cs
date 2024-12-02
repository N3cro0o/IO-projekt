namespace IO.Server.Elements
{
    public class Report
    {
        List<int> results { get; set; } = new List<int>();
        int PassedUsers { get; set; }
        int FailedUsers { get; set; }
    }
}
