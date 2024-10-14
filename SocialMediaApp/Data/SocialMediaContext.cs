using Microsoft.EntityFrameworkCore;
using SocialMediaApp; // Adjust this if your models are in a different namespace

namespace SocialMediaApp.Data // Use the appropriate namespace for your project
{
    public class SocialMediaContext : DbContext
    {
        public SocialMediaContext(DbContextOptions<SocialMediaContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Like> Likes { get; set; }
    

     protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure the relationship between Like, User, and Post
        modelBuilder.Entity<Like>()
            .HasOne(l => l.User)  // One like is associated with one user
            .WithMany(u => u.Likes) // One user can have many likes
            .HasForeignKey(l => l.UserId) // FK to User
            .OnDelete(DeleteBehavior.Cascade); // Cascade delete

        modelBuilder.Entity<Like>()
            .HasOne(l => l.Post)  // One like is associated with one post
            .WithMany(p => p.Likes) // One post can have many likes
            .HasForeignKey(l => l.PostId) // FK to Post
            .OnDelete(DeleteBehavior.Cascade); // Cascade delete
    }
    }
}

