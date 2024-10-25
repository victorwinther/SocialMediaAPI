public class PostDTO
{
    public int Id { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public int UserId { get; set; }
    public int LikeCount { get; set; } // This is the number of likes
    public bool UserHasLiked { get; set; } // Indicates if the current user has liked the post
}
