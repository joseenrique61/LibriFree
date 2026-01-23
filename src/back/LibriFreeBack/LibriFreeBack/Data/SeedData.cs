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
            // Check if already seeded
            if (context.Users.Any())
            {
                return;   // DB has been seeded
            }

            // Seed User
            context.Users.Add(new User
            {
                Username = "admin",
                // The password is "securePassword123"
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("securePassword123")
            });

            // Seed Books
            var books = new[]
            {
                new Book { Title = "Cien años de soledad", Author = "Gabriel García Márquez", Isbn = "9780307474728", Category = "Ficción", Stock = 5 },
                new Book { Title = "El señor de los anillos", Author = "J.R.R. Tolkien", Isbn = "9780544003415", Category = "Fantasía", Stock = 3 },
                new Book { Title = "1984", Author = "George Orwell", Isbn = "9780451524935", Category = "Distopía", Stock = 4 },
                new Book { Title = "Don Quijote de la Mancha", Author = "Miguel de Cervantes", Isbn = "9788437604947", Category = "Clásico", Stock = 2 },
                new Book { Title = "Harry Potter y la piedra filosofal", Author = "J.K. Rowling", Isbn = "9780439708180", Category = "Fantasía", Stock = 6 },
                new Book { Title = "El código Da Vinci", Author = "Dan Brown", Isbn = "9780307474278", Category = "Thriller", Stock = 3 },
                new Book { Title = "Sapiens", Author = "Yuval Noah Harari", Isbn = "9780062316097", Category = "Historia", Stock = 4 },
                new Book { Title = "El principito", Author = "Antoine de SaintExupéry", Isbn = "9780156012195", Category = "Infantil", Stock = 8 },
                new Book { Title = "Orgullo y prejuicio", Author = "Jane Austen", Isbn = "9780141439518", Category = "Romance", Stock = 3 },
                new Book { Title = "Crónica de una muerte anunciada", Author = "Gabriel García Márquez", Isbn = "9780307387981", Category = "Ficción", Stock = 2 },
                new Book { Title = "El hobbit", Author = "J.R.R. Tolkien", Isbn = "9780547928227", Category = "Fantasía", Stock = 4 },
                new Book { Title = "La sombra del viento", Author = "Carlos Ruiz Zafón", Isbn = "9780143034902", Category = "Misterio", Stock = 3 },
                new Book { Title = "Clean Code", Author = "Robert C. Martin", Isbn = "9780132350884", Category = "Programación", Stock = 5 },
                new Book { Title = "El alquimista", Author = "Paulo Coelho", Isbn = "9780062315007", Category = "Ficción", Stock = 4 },
                new Book { Title = "Los juegos del hambre", Author = "Suzanne Collins", Isbn = "9780439023481", Category = "Ciencia Ficción", Stock = 5 }
            };
            context.Books.AddRange(books);

            // Seed Members
            var members = new[]
            {
                new Member { FirstName = "María", LastName = "González", Dni = "1712345675", Email = "maria.gonzalez@email.com", Status = true },
                new Member { FirstName = "Juan", LastName = "Pérez", Dni = "0923456784", Email = "juan.perez@email.com", Status = true },
                new Member { FirstName = "Ana", LastName = "Martínez", Dni = "1301234561", Email = "ana.martinez@email.com", Status = true },
                new Member { FirstName = "Carlos", LastName = "López", Dni = "0112345673", Email = "carlos.lopez@email.com", Status = true },
                new Member { FirstName = "Laura", LastName = "Sánchez", Dni = "0601234560", Email = "laura.sanchez@email.com", Status = true },
                new Member { FirstName = "Diego", LastName = "Rodríguez", Dni = "1012345672", Email = "diego.rodriguez@email.com", Status = true },
                new Member { FirstName = "Sofía", LastName = "Fernández", Dni = "0512345679", Email = "sofia.fernandez@email.com", Status = true },
                new Member { FirstName = "Miguel", LastName = "García", Dni = "1812345674", Email = "miguel.garcia@email.com", Status = true }
            };
            context.Members.AddRange(members);

            context.SaveChanges();

            // Seed Loans (need to save first to get IDs)
            var loans = new[]
            {
                // Active loans
                new Loan
                {
                    BookId = books[0].Id,
                    MemberId = members[0].Id,
                    LoanDate = DateTime.Now.AddDays(-5),
                    DueDate = DateTime.Now.AddDays(9),
                    Status = LoanStatus.Active
                },
                new Loan
                {
                    BookId = books[1].Id,
                    MemberId = members[1].Id,
                    LoanDate = DateTime.Now.AddDays(-3),
                    DueDate = DateTime.Now.AddDays(11),
                    Status = LoanStatus.Active
                },
                new Loan
                {
                    BookId = books[4].Id,
                    MemberId = members[2].Id,
                    LoanDate = DateTime.Now.AddDays(-7),
                    DueDate = DateTime.Now.AddDays(7),
                    Status = LoanStatus.Active
                },

                // Overdue loans
                new Loan
                {
                    BookId = books[2].Id,
                    MemberId = members[3].Id,
                    LoanDate = DateTime.Now.AddDays(-20),
                    DueDate = DateTime.Now.AddDays(-6),
                    Status = LoanStatus.Overdue
                },
                new Loan
                {
                    BookId = books[5].Id,
                    MemberId = members[4].Id,
                    LoanDate = DateTime.Now.AddDays(-18),
                    DueDate = DateTime.Now.AddDays(-4),
                    Status = LoanStatus.Overdue
                },

                // Returned loans
                new Loan
                {
                    BookId = books[3].Id,
                    MemberId = members[5].Id,
                    LoanDate = DateTime.Now.AddDays(-30),
                    DueDate = DateTime.Now.AddDays(-16),
                    ReturnDate = DateTime.Now.AddDays(-17),
                    Status = LoanStatus.Returned
                },
                new Loan
                {
                    BookId = books[6].Id,
                    MemberId = members[6].Id,
                    LoanDate = DateTime.Now.AddDays(-25),
                    DueDate = DateTime.Now.AddDays(-11),
                    ReturnDate = DateTime.Now.AddDays(-12),
                    Status = LoanStatus.Returned
                },
                new Loan
                {
                    BookId = books[7].Id,
                    MemberId = members[7].Id,
                    LoanDate = DateTime.Now.AddDays(-15),
                    DueDate = DateTime.Now.AddDays(-1),
                    ReturnDate = DateTime.Now.AddDays(-2),
                    Status = LoanStatus.Returned
                }
            };
            context.Loans.AddRange(loans);

            context.SaveChanges();
        }
    }
}
