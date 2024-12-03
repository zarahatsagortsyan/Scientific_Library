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
        //protected override void OnModelCreating(ModelBuilder builder)
        //{

        //}
        public DbSet<ExtendedIdentityUser> Users { get; set; }

    }
}
