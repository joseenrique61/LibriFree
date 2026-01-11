using System;

namespace LibriFreeBack.Models.DTOs;

public class LoanDto
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public required string BookTitle { get; set; }
    public int MemberId { get; set; }
    public required string MemberName { get; set; }
    public DateTime LoanDate { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? ReturnDate { get; set; }
    public required string Status { get; set; }
}
