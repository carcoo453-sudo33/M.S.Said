using System;

namespace Portfolio.API.DTOs;

public class SkillDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public int Order { get; set; }
}
