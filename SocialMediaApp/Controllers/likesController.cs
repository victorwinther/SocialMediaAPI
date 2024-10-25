using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using SocialMediaApp.Data;
using System.Linq;
using System.Threading.Tasks;

    [Route("api/[controller]")]
    [ApiController]
    public class LikesController : ControllerBase
    {
        private readonly SocialMediaContext _context;

        public LikesController(SocialMediaContext context)
        {
            _context = context;
        }

        // POST: api/likes/{postId}
        [HttpPost("{postId}")]
        public async Task<IActionResult> LikePost(int postId, int userId)
        {
            // Check if the post exists
            var post = await _context.Posts.FindAsync(postId);
            if (post == null)
            {
                return NotFound(new { message = "Post not found" });
            }

            // Check if the like already exists (avoid duplicate likes)
            var existingLike = _context.Likes.FirstOrDefault(l => l.PostId == postId && l.UserId == userId);
            if (existingLike != null)
            {
                return BadRequest(new { message = "User has already liked this post" });
            }

            // Create a new like
            var like = new Like
            {
                PostId = postId,
                UserId = userId
            };

            _context.Likes.Add(like);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Post liked successfully" });
        }

       // DELETE: api/likes/{postId}/unlike
        [HttpDelete("{postId}/unlike")]
        public async Task<IActionResult> UnlikePost(int postId, [FromQuery] int userId) // Using query param for userId
        {
            var post = await _context.Posts.FindAsync(postId);
            if (post == null)
            {
                return NotFound(new { message = "Post not found" });
            }

            var like = await _context.Likes.FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);
            if (like == null)
            {
                return NotFound(new { message = "Like not found" });
            }

            _context.Likes.Remove(like);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Post unliked successfully" });
        }

    }

