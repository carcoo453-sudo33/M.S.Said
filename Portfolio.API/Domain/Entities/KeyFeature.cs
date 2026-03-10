using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Portfolio.API.Enums;

namespace Portfolio.API.Entities;

public class KeyFeature : BaseEntity
{
    public Guid ProjectId { get; set; }
    
    [Required]
    public string Title { get; set; } = string.Empty;
    public string? Title_Ar { get; set; }
    
    public string? Link { get; set; }
    
    public string? Date { get; set; }
    
    public FeatureType FeatureType { get; set; } = FeatureType.Added;
}