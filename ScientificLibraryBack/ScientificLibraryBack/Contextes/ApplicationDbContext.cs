using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Hosting;
using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.Services.DBService;

namespace ScientificLibraryBack.Contextes
{
    public class ApplicationDbContext : IdentityDbContext
    {
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
            modelBuilder.Entity<Review>()
            .HasOne(r => r.Book)
            .WithMany(b => b.Reviews)
            .HasForeignKey(r => r.BookId)
            .OnDelete(DeleteBehavior.Restrict); 


            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserBook>()
                         .HasIndex(ub => new { ub.BookId, ub.UserId })
                         .IsUnique();

            modelBuilder.Entity<BookKeyword>()
                .HasOne(bk => bk.Book)
                .WithMany(b => b.BookKeywords)
                .HasForeignKey(bk => bk.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BookKeyword>()
                .HasOne(bk => bk.Keyword)
                .WithMany(k => k.BookKeywords)
                .HasForeignKey(bk => bk.KeywordId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Book>()
            .HasOne(b => b.Genre)
            .WithMany()
            .HasForeignKey(b => b.GenreId)
            .OnDelete(DeleteBehavior.Restrict); 
        }
        public DbSet<Book> Books { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<UserBook> UserBooks { get; set; }
        public DbSet<Genre> Genres{ get; set; }
        public DbSet<Language> Languages { get; set; }
        public DbSet<Keyword> Keywords { get; set; }
        public DbSet<BookKeyword> BookKeywords { get; set; }
        public DbSet<Message> Messages { get; set; }

    }
}
