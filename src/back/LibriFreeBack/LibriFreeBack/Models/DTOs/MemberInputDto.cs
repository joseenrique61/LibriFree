using System.ComponentModel.DataAnnotations;

namespace LibriFreeBack.Models.DTOs;

public class MemberInputDto
{
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
    public required bool Status { get; set; }
}
