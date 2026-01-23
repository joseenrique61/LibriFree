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
public class LoansController : ControllerBase
{
    private readonly LibriFreeContext _context;

    public LoansController(LibriFreeContext context)
    {
        _context = context;
    }

    // GET /Loans - List all loans with optional status filter
    [HttpGet]
    public async Task<ActionResult<IEnumerable<LoanDto>>> GetLoans([FromQuery] string? status = null)
    {
        var query = _context.Loans
            .Include(l => l.Book)
            .Include(l => l.Member)
            .AsQueryable();

        // Filter by status if provided
        if (!string.IsNullOrEmpty(status))
        {
            if (Enum.TryParse<LoanStatus>(status, true, out var loanStatus))
            {
                query = query.Where(l => l.Status == loanStatus);
            }
        }

        var loans = await query
            .OrderByDescending(l => l.LoanDate)
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

    // GET /Loans/{id} - Get single loan
    [HttpGet("{id}")]
    public async Task<ActionResult<LoanDto>> GetLoanById(int id)
    {
        var loan = await _context.Loans
            .Include(l => l.Book)
            .Include(l => l.Member)
            .Where(l => l.Id == id)
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
            .FirstOrDefaultAsync();

        if (loan == null)
        {
            return NotFound(new ErrorDto { Code = 404, Message = "Loan not found." });
        }

        return Ok(loan);
    }

    // POST /Loans - Create new loan
    [HttpPost]
    public async Task<ActionResult<LoanDto>> CreateLoan([FromBody] LoanInputDto loanInput)
    {
        // Validate book exists
        var book = await _context.Books.FindAsync(loanInput.BookId);
        if (book == null)
        {
            return NotFound(new ErrorDto { Code = 404, Message = "Book not found." });
        }

        // Validate member exists
        var member = await _context.Members.FindAsync(loanInput.MemberId);
        if (member == null)
        {
            return NotFound(new ErrorDto { Code = 404, Message = "Member not found." });
        }

        // Calculate available stock (stock - active loans)
        var activeLoansCount = await _context.Loans
            .Where(l => l.BookId == loanInput.BookId && l.Status == LoanStatus.Active)
            .CountAsync();

        var availableStock = book.Stock - activeLoansCount;

        // US11: Block loan if no stock available
        if (availableStock <= 0)
        {
            return BadRequest(new ErrorDto { Code = 400, Message = "No hay stock disponible para este libro." });
        }

        // US12: Calculate due date (7 days from now if not provided or in the past)
        var dueDate = loanInput.DueDate;
        if (dueDate <= DateTime.Now)
        {
            dueDate = DateTime.Now.AddDays(7);
        }

        // Create the loan
        var loan = new Loan
        {
            BookId = loanInput.BookId,
            MemberId = loanInput.MemberId,
            LoanDate = DateTime.Now,
            DueDate = dueDate,
            Status = LoanStatus.Active
        };

        _context.Loans.Add(loan);
        await _context.SaveChangesAsync();

        // Return the created loan
        var loanDto = new LoanDto
        {
            Id = loan.Id,
            BookId = loan.BookId,
            BookTitle = book.Title,
            MemberId = loan.MemberId,
            MemberName = member.FirstName + " " + member.LastName,
            LoanDate = loan.LoanDate,
            DueDate = loan.DueDate,
            ReturnDate = loan.ReturnDate,
            Status = loan.Status.ToString()
        };

        return CreatedAtAction(nameof(GetLoanById), new { id = loan.Id }, loanDto);
    }

    // PUT /Loans/{id}/return - Return a book
    [HttpPut("{id}/return")]
    public async Task<ActionResult<LoanDto>> ReturnLoan(int id)
    {
        var loan = await _context.Loans
            .Include(l => l.Book)
            .Include(l => l.Member)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (loan == null)
        {
            return NotFound(new ErrorDto { Code = 404, Message = "Loan not found." });
        }

        // Check if already returned
        if (loan.Status == LoanStatus.Returned)
        {
            return BadRequest(new ErrorDto { Code = 400, Message = "Este préstamo ya fue devuelto." });
        }

        // US13: Register return
        loan.Status = LoanStatus.Returned;
        loan.ReturnDate = DateTime.Now;

        await _context.SaveChangesAsync();

        var loanDto = new LoanDto
        {
            Id = loan.Id,
            BookId = loan.BookId,
            BookTitle = loan.Book!.Title,
            MemberId = loan.MemberId,
            MemberName = loan.Member!.FirstName + " " + loan.Member.LastName,
            LoanDate = loan.LoanDate,
            DueDate = loan.DueDate,
            ReturnDate = loan.ReturnDate,
            Status = loan.Status.ToString()
        };

        return Ok(loanDto);
    }

    // GET /Loans/active - Get only active loans (US14)
    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<LoanDto>>> GetActiveLoans()
    {
        var loans = await _context.Loans
            .Include(l => l.Book)
            .Include(l => l.Member)
            .Where(l => l.Status == LoanStatus.Active || l.Status == LoanStatus.Overdue)
            .OrderByDescending(l => l.LoanDate)
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
