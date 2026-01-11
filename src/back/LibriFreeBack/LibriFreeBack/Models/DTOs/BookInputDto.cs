using System.ComponentModel.DataAnnotations;

namespace LibriFreeBack.Models.DTOs;

public class BookInputDto
{
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
    [Range(0, int.MaxValue)]
    public int Stock { get; set; }
}
