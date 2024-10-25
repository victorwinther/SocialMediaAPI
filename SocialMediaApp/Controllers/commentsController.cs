using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using SocialMediaApp.Data;
using System.Linq;
using System.Threading.Tasks;

    [Route("api/[controller]")]
    [ApiController]
    public class commentsController : ControllerBase
    {
        private readonly SocialMediaContext _context;

        public commentsController(SocialMediaContext context)
        {
            _context = context;
        }

        // POST: api/comments/{postId}
        [HttpPost("{postId}")]
        public async Task<IActionResult> PostComment([FromBody] CommentDto commentDto, int postId, int userId)
        {
            // Check if the post exists
            var post = await _context.Posts.FindAsync(postId);
            if (post == null)
            {
                return NotFound(new { message = "Post not found" });
            }
              // Check if the user exists
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

           // Create the new comment
        var comment = new Comment
        {
            Content = commentDto.Content,
            CreatedAt = DateTime.UtcNow,
            PostId = postId,
            UserId = userId
        };
        // Add the comment to the database
        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Comment added successfully", comment });
    }

        // GET: api/comments/{postId}
    [HttpGet("{postId}")]
    public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsForPost(int postId)
    {
        // Check if the post exists
        var post = await _context.Posts.FindAsync(postId);
        if (post == null)
        {
            return NotFound(new { message = "Post not found" });
        }

        // Retrieve comments for the post
        var comments = await _context.Comments
            .Where(c => c.PostId == postId)
            .Include(c => c.User) // Optionally include user details
            .ToListAsync();

        return Ok(comments);
    }

}