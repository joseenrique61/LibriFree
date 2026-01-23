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

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LoanDto>>> GetLoans()
    {
        var loans = await _context.Loans
            .Include(l => l.Book)
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

    [HttpPost]
    public async Task<ActionResult<LoanDto>> CreateLoan([FromBody] LoanInputDto loanDto)
    {
        // Check if book and member exist
        var book = await _context.Books.Include(b => b.Loans).FirstOrDefaultAsync(b => b.Id == loanDto.BookId);
        var member = await _context.Members.FindAsync(loanDto.MemberId);

        if (book == null || member == null)
        {
            return BadRequest(new ErrorDto { Code = 400, Message = "Invalid BookId or MemberId." });
        }

        // Check for availability
        var availableStock = book.Stock - book.Loans.Count(l => l.Status == LoanStatus.Active);
        if (availableStock <= 0)
        {
            return BadRequest(new ErrorDto { Code = 400, Message = "Book is currently out of stock." });
        }
        
        var loan = new Loan
        {
            BookId = loanDto.BookId,
            MemberId = loanDto.MemberId,
            LoanDate = DateTime.UtcNow,
            DueDate = loanDto.DueDate,
            Status = LoanStatus.Active
        };

        _context.Loans.Add(loan);
        await _context.SaveChangesAsync();

        var loanResponse = new LoanDto
        {
            Id = loan.Id,
            BookId = loan.BookId,
            BookTitle = book.Title,
            MemberId = loan.MemberId,
            MemberName = member.FirstName + " " + member.LastName,
            LoanDate = loan.LoanDate,
            DueDate = loan.DueDate,
            Status = loan.Status.ToString()
        };

        return Ok(loanResponse);
    }

    [HttpPut("{id}/return")]
    public async Task<ActionResult<LoanDto>> ReturnLoan(int id)
    {
        var loan = await _context.Loans
            .Include(l => l.Book)
            .Include(l => l.Member)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (loan == null)
        {
            return NotFound();
        }

        if (loan.Status == LoanStatus.Returned)
        {
            return BadRequest(new ErrorDto { Code = 400, Message = "Loan has already been returned."});
        }

        loan.Status = LoanStatus.Returned;
        loan.ReturnDate = DateTime.UtcNow;

        _context.Entry(loan).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        
        var loanResponse = new LoanDto
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

        return Ok(loanResponse);
    }
}
