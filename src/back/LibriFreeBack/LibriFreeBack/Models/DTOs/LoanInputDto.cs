using System;
using System.ComponentModel.DataAnnotations;

namespace LibriFreeBack.Models.DTOs;

public class LoanInputDto
{
    [Required]
    public int BookId { get; set; }

    [Required]
    public int MemberId { get; set; }

    [Required]
    public DateTime DueDate { get; set; }
}
