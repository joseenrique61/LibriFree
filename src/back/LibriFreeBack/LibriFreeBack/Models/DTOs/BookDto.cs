namespace LibriFreeBack.Models.DTOs;

public class BookDto : BookInputDto
{
    public int Id { get; set; }
    public int Available { get; set; }
}
