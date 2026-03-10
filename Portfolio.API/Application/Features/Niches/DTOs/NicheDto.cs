namespace Portfolio.API.Application.Features.Niches.DTOs;

public record NicheDto(
    Guid Id,
    string Name = "",
    string? Name_Ar = null,
    DateTime CreatedAt = default,
    DateTime? UpdatedAt = null
);


