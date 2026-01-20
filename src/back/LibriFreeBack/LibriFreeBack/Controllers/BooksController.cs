using LibriFreeBack.Data;
using LibriFreeBack.Models;
using LibriFreeBack.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibriFreeBack.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class BooksController : ControllerBase
{
    private readonly LibriFreeContext _context;

    public BooksController(LibriFreeContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks([FromQuery] string? search, [FromQuery] string? category)
    {
        var query = _context.Books.AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(b => b.Title.Contains(search) || b.Author.Contains(search));
        }

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(b => b.Category == category);
        }

        var books = await query
            .Select(b => new BookDto
            {
                Id = b.Id,
                Title = b.Title,
                Author = b.Author,
                Isbn = b.Isbn,
                Category = b.Category,
                Stock = b.Stock,
                Available = b.Stock - b.Loans.Count(l => l.Status == LoanStatus.Active)
            })
            .ToListAsync();

        return Ok(books);
    }

    [HttpPost]
    public async Task<ActionResult<BookDto>> CreateBook([FromBody] BookInputDto bookDto)
    {
        var book = new Book
        {
            Title = bookDto.Title,
            Author = bookDto.Author,
            Isbn = bookDto.Isbn,
            Category = bookDto.Category,
            Stock = bookDto.Stock
        };

        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        var bookResponse = new BookDto
        {
            Id = book.Id,
            Title = book.Title,
            Author = book.Author,
            Isbn = book.Isbn,
            Category = book.Category,
            Stock = book.Stock,
            Available = book.Stock // Initially, all stock is available
        };

        return CreatedAtAction(nameof(GetBookById), new { id = book.Id }, bookResponse);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookDto>> GetBookById(int id)
    {
        var book = await _context.Books
            .Select(b => new BookDto
            {
                Id = b.Id,
                Title = b.Title,
                Author = b.Author,
                Isbn = b.Isbn,
                Category = b.Category,
                Stock = b.Stock,
                Available = b.Stock - b.Loans.Count(l => l.Status == LoanStatus.Active)
            })
            .FirstOrDefaultAsync(b => b.Id == id);

        if (book == null)
        {
            return NotFound();
        }

        return Ok(book);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(int id, [FromBody] BookInputDto bookDto)
    {
        var book = await _context.Books.FindAsync(id);

        if (book == null)
        {
            return NotFound();
        }

        book.Title = bookDto.Title;
        book.Author = bookDto.Author;
        book.Isbn = bookDto.Isbn;
        book.Category = bookDto.Category;
        book.Stock = bookDto.Stock;

        _context.Entry(book).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Books.Any(e => e.Id == id))
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

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null)
        {
            return NotFound();
        }

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();

        return NoContent();
    }
    
    [HttpGet("{id}/loans")]
    public async Task<ActionResult<IEnumerable<LoanDto>>> GetBookLoanHistory(int id)
    {
        if (!await _context.Books.AnyAsync(b => b.Id == id))
        {
            return NotFound(new ErrorDto { Code = 404, Message = "Book not found."});
        }
        
        var loans = await _context.Loans
            .Where(l => l.BookId == id)
            .Include(l => l.Member)
            .Select(l => new LoanDto
            {
                Id = l.Id,
                BookId = l.BookId,
                BookTitle = l.Book!.Title,
                MemberId = l.MemberId,
                MemberName = l.Member!.FirstName + " " + l.Member.LastName,
                LoanDate = l.LoanDate,
                DueDate = l.DueDate,
                ReturnDate = l.ReturnDate,
                Status = l.Status.ToString()
            })
            .ToListAsync();
            
        return Ok(loans);
    }
}
