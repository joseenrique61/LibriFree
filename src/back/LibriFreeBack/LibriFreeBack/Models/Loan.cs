using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibriFreeBack.Models;

public enum LoanStatus
{
    Active,
    Returned,
    Overdue
}

public class Loan
{
    public int Id { get; set; }

    [Required]
    public int BookId { get; set; }

    [Required]
    public int MemberId { get; set; }

    [Required]
    public DateTime LoanDate { get; set; }

    [Required]
    public DateTime DueDate { get; set; }

    public DateTime? ReturnDate { get; set; }

    [Required]
    public LoanStatus Status { get; set; }

    // Navigation properties
    [ForeignKey("BookId")]
    public Book? Book { get; set; }

    [ForeignKey("MemberId")]
    public Member? Member { get; set; }
}
