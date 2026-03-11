using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Portfolio.API.Domain.Enums;

namespace Portfolio.API.Entities;

public class Reaction : BaseEntity
{
    public Guid ProjectId { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    public ReactionType ReactionType { get; set; } = ReactionType.Like;
}
