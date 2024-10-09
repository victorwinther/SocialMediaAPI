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
        return await _context.Posts
            .Include(p => p.User) // Inkluder brugeren for hvert indlæg
            .Include(p => p.Comments) // Inkluder kommentarer
            .ToListAsync();
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
        var post = await _context.Posts
            .Include(p => p.User)
            .Include(p => p.Comments)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (post == null)
        {
            return NotFound();
        }

        return post;
    }

    // POST: api/Posts
    [HttpPost]
    public async Task<ActionResult<Post>> CreatePost(Post post)
    {
        post.CreatedAt = DateTime.UtcNow;
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPost", new { id = post.Id }, post);
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
