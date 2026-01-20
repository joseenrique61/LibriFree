using LibriFreeBack.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace LibriFreeBack.Data;

public static class SeedData
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using (var context = new LibriFreeContext(
            serviceProvider.GetRequiredService<DbContextOptions<LibriFreeContext>>()))
        {
            // Look for any users.
            if (context.Users.Any())
            {
                return;   // DB has been seeded
            }

            context.Users.Add(new User
            {
                Username = "admin",
                // DO NOT store plain text passwords in production. This is for demonstration only.
                // The password is "securePassword123"
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("securePassword123")
            });
            
            context.SaveChanges();
        }
    }
}
