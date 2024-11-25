using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Hosting;

namespace ScientificLibraryBack.Models.DB
{
    public class ApplicationDbContext:IdentityDbContext<IdentityUser>
    {
        //The code shown provides a special constructor that makes it possible to configure the database for different environments.
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options):
            base(options) { }
        protected override void OnModelCreating(ModelBuilder builder)
        { 
            
        }
        public DbSet<User> Users { get; set; }

    }
}
