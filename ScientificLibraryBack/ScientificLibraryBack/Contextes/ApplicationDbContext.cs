using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Hosting;
using ScientificLibraryBack.Models.DB;

namespace ScientificLibraryBack.Contextes
{
    public class ApplicationDbContext : IdentityDbContext
    {
        //The code shown provides a special constructor that makes it possible to configure the database for different environments.
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) :
            base(options)
        {
            try
            {
                var databaseCreator = Database.GetService<IDatabaseCreator>() as RelationalDatabaseCreator;
                if (databaseCreator != null)
                {
                    if (!databaseCreator.CanConnect())
                        databaseCreator.Create();
                    if (!databaseCreator.HasTables())
                        databaseCreator.CreateTables();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Specify "no action" for the cascade delete on the relationship between Reviews and Books
            modelBuilder.Entity<Review>()
            .HasOne(r => r.Book)
            .WithMany(b => b.Reviews)
            .HasForeignKey(r => r.BookId)
            .OnDelete(DeleteBehavior.Restrict); // NO ACTION or Restrict

            //modelBuilder.Entity<Book>()
            //.HasOne(b => b.Publisher)
            //.WithMany() // Specify if a Publisher has a collection of books, e.g., `.WithMany(p => p.Books)`
            //.HasForeignKey(b => b.PublisherId)
            //.OnDelete(DeleteBehavior.Cascade); // Optional: Set delete behavior

            base.OnModelCreating(modelBuilder);

        }
        //public DbSet<ExtendedIdentityUser> Users { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Review> Reviews { get; set; }
    }
}
