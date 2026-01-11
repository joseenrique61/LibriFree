namespace LibriFreeBack.Models.DTOs;

public class AuthResponseDto
{
    public required string Token { get; set; }
    public int ExpiresIn { get; set; }
}
