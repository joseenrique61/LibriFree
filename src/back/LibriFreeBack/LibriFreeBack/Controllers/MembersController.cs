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
public class MembersController : ControllerBase
{
    private readonly LibriFreeContext _context;

    public MembersController(LibriFreeContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetMembers()
    {
        var members = await _context.Members
            .Select(m => new MemberDto
            {
                Id = m.Id,
                FirstName = m.FirstName,
                LastName = m.LastName,
                Dni = m.Dni,
                Email = m.Email
            })
            .ToListAsync();
            
        return Ok(members);
    }

    [HttpPost]
    public async Task<ActionResult<MemberDto>> CreateMember([FromBody] MemberInputDto memberDto)
    {
        var member = new Member
        {
            FirstName = memberDto.FirstName,
            LastName = memberDto.LastName,
            Dni = memberDto.Dni,
            Email = memberDto.Email
        };

        _context.Members.Add(member);
        await _context.SaveChangesAsync();

        var memberResponse = new MemberDto
        {
            Id = member.Id,
            FirstName = member.FirstName,
            LastName = member.LastName,
            Dni = member.Dni,
            Email = member.Email
        };

        return CreatedAtAction(nameof(GetMemberById), new { id = member.Id }, memberResponse);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MemberDto>> GetMemberById(int id)
    {
        var member = await _context.Members
            .Select(m => new MemberDto
            {
                Id = m.Id,
                FirstName = m.FirstName,
                LastName = m.LastName,
                Dni = m.Dni,
                Email = m.Email
            })
            .FirstOrDefaultAsync(m => m.Id == id);

        if (member == null)
        {
            return NotFound();
        }

        return Ok(member);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMember(int id, [FromBody] MemberInputDto memberDto)
    {
        var member = await _context.Members.FindAsync(id);

        if (member == null)
        {
            return NotFound();
        }

        member.FirstName = memberDto.FirstName;
        member.LastName = memberDto.LastName;
        member.Dni = memberDto.Dni;
        member.Email = memberDto.Email;

        _context.Entry(member).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Members.Any(e => e.Id == id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return Ok();
    }

    [HttpGet("{id}/loans")]
    public async Task<ActionResult<IEnumerable<LoanDto>>> GetMemberLoanHistory(int id)
    {
        if (!await _context.Members.AnyAsync(m => m.Id == id))
        {
            return NotFound(new ErrorDto { Code = 404, Message = "Member not found." });
        }

        var loans = await _context.Loans
            .Where(l => l.MemberId == id)
            .Include(l => l.Book)
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
