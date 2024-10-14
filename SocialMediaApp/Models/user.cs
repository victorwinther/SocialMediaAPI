 public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }

    // Navigation property to hold the Likes
    public List<Like> Likes { get; set; }
}
