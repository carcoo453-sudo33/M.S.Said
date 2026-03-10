using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio.API.Entities;

public class ChangelogItem : BaseEntity
{
    public Guid ProjectId { get; set; }
    
    public string Date { get; set; } = string.Empty;
    
    public string Version { get; set; } = string.Empty;
    
    [Required]
    public string Title { get; set; } = string.Empty;
    public string? Title_Ar { get; set; }
    
    public string Description { get; set; } = string.Empty;
    public string? Description_Ar { get; set; }
}