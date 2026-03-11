namespace Portfolio.API.Entities;

public class Category : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Name_Ar { get; set; }
}
