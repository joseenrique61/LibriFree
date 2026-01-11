using System.ComponentModel.DataAnnotations;

namespace LibriFreeBack.Models;

public class Book
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public required string Title { get; set; }

    [Required]
    [StringLength(100)]
    public required string Author { get; set; }

    [Required]
    [StringLength(20)]
    public required string Isbn { get; set; }

    [StringLength(50)]
    public string? Category { get; set; }

    [Required]
    public int Stock { get; set; }
    
    // Navigation property for related loans
    public ICollection<Loan> Loans { get; set; } = new List<Loan>();
}
