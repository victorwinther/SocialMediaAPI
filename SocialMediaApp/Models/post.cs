public class Post
{
  public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; } // Nullable User to avoid validation error
        public List<Comment>? Comments { get; set; } = new List<Comment>(); // Nullable Comments list

         // Navigation property to hold the Likes
    public List<Like> Likes { get; set; } = new List<Like>(); // Initialize as an empty list

}
