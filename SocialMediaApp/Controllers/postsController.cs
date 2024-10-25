using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using SocialMediaApp.Data;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class PostsController : ControllerBase
{
    private readonly SocialMediaContext _context;

    public PostsController(SocialMediaContext context)
    {
        _context = context;
    }

    // GET: api/Posts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Post>>> GetPosts()
    {
       var posts = await _context.Posts
        .Include(p => p.User)
        .Include(p => p.Comments)
        .Include(p => p.Likes) // Include likes to get the count
        .Select(p => new PostDTO
        {
            Id = p.Id,
            Content = p.Content,
            CreatedAt = p.CreatedAt,
            UserId = p.UserId,
            LikeCount = p.Likes.Count,  // Return the count of likes
            UserHasLiked = false  // You can set this dynamically based on the current user
        })
        .ToListAsync();

    return Ok(posts);
}

    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok("The PostsController is working!");
    }


    // GET: api/Posts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Post>> GetPost(int id)
   {
   var posts = await _context.Posts
        .Include(p => p.User)
        .Include(p => p.Comments)
        .Include(p => p.Likes)
        .Select(p => new 
        {
            Id = p.Id,
            Content = p.Content,
            CreatedAt = p.CreatedAt,
            UserId = p.UserId,
            User = p.User.Username,
            LikeCount = p.Likes.Count(),
            UserHasLiked = p.Likes.Any(l => l.UserId == id),  // Check if this user has liked the post
            Comments = p.Comments.Select(c => new 
            {
                Id = c.Id,
                Content = c.Content,
                User = c.User.Username,
                CreatedAt = c.CreatedAt
            }).ToList()
        })
        .ToListAsync();

    return Ok(posts);

}

    // POST: api/Posts
    [HttpPost]
public async Task<ActionResult<Post>> CreatePost(Post post)
{
    try
    {
        if (post == null || string.IsNullOrEmpty(post.Content) || post.UserId == 0)
        {
            return BadRequest("Invalid post data");
        }

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPost", new { id = post.Id }, post);
    }
    catch (Exception ex)
    {
        // Log exception to help debug
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}


    // PUT: api/Posts/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePost(int id, Post post)
    {
        if (id != post.Id)
        {
            return BadRequest();
        }

        _context.Entry(post).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PostExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/Posts/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null)
        {
            return NotFound();
        }

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool PostExists(int id)
    {
        return _context.Posts.Any(e => e.Id == id);
    }
}
