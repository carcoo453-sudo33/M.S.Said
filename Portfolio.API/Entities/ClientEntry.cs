using System;
using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Entities;

public class ClientEntry : BaseEntity
{
    [Required]
    public string Name { get; set; } = string.Empty;
    
    public string? LogoUrl { get; set; }
    
    public int Order { get; set; } = 0;
}
