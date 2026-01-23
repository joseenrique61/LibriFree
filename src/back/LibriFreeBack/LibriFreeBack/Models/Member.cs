using System.ComponentModel.DataAnnotations;

namespace LibriFreeBack.Models;

public class Member
{
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public required string FirstName { get; set; }

    [Required]
    [StringLength(50)]
    public required string LastName { get; set; }

    [Required]
    [StringLength(20)]
    public required string Dni { get; set; }

    [Required]
    [StringLength(100)]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    public required bool Status { get; set; } = true;
    
    // Navigation property for related loans
    public ICollection<Loan> Loans { get; set; } = new List<Loan>();
}
