using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ScientificLibraryBack.Contextes;
using ScientificLibraryBack.Models.DB;
using System;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;

namespace ScientificLibraryBack.Services.DBService
{
    public class DatabaseInitializer
    {
        public static async Task SeedLanguages(IServiceProvider serviceProvider)
        {

            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();

            if (!context.Languages.Any())
            {
                var languages = new List<Language>()
                {
                    new Language { Id = Guid.NewGuid(), Name = "English" },
                    new Language { Id = Guid.NewGuid(), Name = "French" },
                    new Language { Id = Guid.NewGuid(), Name = "Spanish" },
                    new Language { Id = Guid.NewGuid(), Name = "German" },
                    new Language { Id = Guid.NewGuid(), Name = "Italian" },
                    new Language { Id = Guid.NewGuid(), Name = "Russian" },
                    new Language { Id = Guid.NewGuid(), Name = "Chinese" },
                    new Language { Id = Guid.NewGuid(), Name = "Japanese" },
                    new Language { Id = Guid.NewGuid(), Name = "Korean" },
                    new Language { Id = Guid.NewGuid(), Name = "Arabic" },
                    new Language { Id = Guid.NewGuid(), Name = "Armenian" },
                    new Language { Id = Guid.NewGuid(), Name = "Thai" }
                };

                await context.Languages.AddRangeAsync(languages);
                await context.SaveChangesAsync();
            }

        }


        public static async Task SeedKeywords(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                if (!await context.Keywords.AnyAsync())
                {
                    var keywords = new List<Keyword>
                {
                    new Keyword { Id = Guid.NewGuid(), Name = "Machine Learning" },
                    new Keyword { Id = Guid.NewGuid(), Name = "Artificial Intelligence" },
                    new Keyword { Id = Guid.NewGuid(), Name = "Quantum Computing" },
                    new Keyword { Id = Guid.NewGuid(), Name = "Data Science" },
                    new Keyword { Id = Guid.NewGuid(), Name = "Neuroscience" },
                    new Keyword { Id = Guid.NewGuid(), Name = "Science" },
                    new Keyword { Id = Guid.NewGuid(), Name = "Technology" },
                    new Keyword { Id = Guid.NewGuid(), Name = "Engineering" },
                    new Keyword { Id = Guid.NewGuid(), Name = "Mathematics" },
                    new Keyword { Id = Guid.NewGuid(), Name = "AI" },
                    new Keyword { Id = Guid.NewGuid(), Name = "Blockchain" },
                    new Keyword { Id = Guid.NewGuid(), Name = "Other" }

                };

                    await context.Keywords.AddRangeAsync(keywords);
                    await context.SaveChangesAsync();
                }
            }
        }

        public static async Task SeedGenres(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                
                // Only seed if the table is empty
                if (!await context.Genres.AnyAsync()) 
                {
                    var genres = new List<Genre>
            {
                new Genre { Name = "Science Fiction", Description = "Fiction based on futuristic science and technology" },
                new Genre { Name = "Fantasy", Description = "Magical and supernatural elements in a fictional world" },
                new Genre { Name = "Mystery", Description = "Crime, detective, and suspenseful storytelling" },
                new Genre { Name = "Romance", Description = "Love stories with emotional connections" },
                new Genre { Name = "Horror", Description = "Frightening and supernatural themes" },
                new Genre { Name = "Thriller", Description = "High-stakes, suspenseful storytelling" },
                new Genre { Name = "Historical Fiction", Description = "Stories set in historical periods" },
                new Genre { Name = "Biography", Description = "Accounts of real people's lives" },
                new Genre { Name = "Self-Help", Description = "Guidance for personal development" },
                new Genre { Name = "Philosophy", Description = "Books exploring philosophical ideas" },
                new Genre { Name = "Science", Description = "Books based on scientific knowledge" },
                new Genre { Name = "Engineering", Description = "Books covering engineering concepts" },
                new Genre { Name = "Mathematics", Description = "Books focusing on mathematical theories" },
                new Genre { Name = "Technology", Description = "Books about technological advancements" }
            };

                    await context.Genres.AddRangeAsync(genres);
                    await context.SaveChangesAsync();
                }
            }
        }
        public static async Task SeedRoles(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                var roles = new[] { "Admin", "Publisher", "Reader" };

                foreach (var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                    {
                        await roleManager.CreateAsync(new IdentityRole(role));
                    }
                }
            }
        }
        public static async Task CreateAdmin(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ExtendedIdentityUser>>();

            string email = "admin@admin.com";
            string password = "Test123!@#";

            if (await userManager.FindByEmailAsync(email) == null)
            {
                var user = new ExtendedIdentityUser();
                user.Type = UserType.Admin;
                user.Email = email;
                user.UserName = email;
                user.EmailConfirmed = true;
                await userManager.CreateAsync(user, password);
                await userManager.AddToRoleAsync(user, "Admin");
            }
        }
    }
}
