using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Bio.DTOs;
using Portfolio.API.Application.Features.Bio.Mappers;

namespace Portfolio.API.Application.Features.Bio.Services;

public class BioService : IBioService
{
    private readonly IUnitOfWork _unitOfWork;

    public BioService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BioDto?> GetBioAsync()
    {
        var bio = (await _unitOfWork.Repository<Entities.Bio>().GetAllAsync()).FirstOrDefault();
        return bio != null ? BioMapper.ToDto(bio) : null;
    }

    public async Task<BioDto> UpdateBioAsync(Guid id, BioDto dto)
    {
        var repository = _unitOfWork.Repository<Entities.Bio>();
        var bio = (await repository.GetAllAsync()).FirstOrDefault();

        if (bio == null)
        {
            bio = new Entities.Bio { Id = id };
            await repository.AddAsync(bio);
        }

        BioMapper.UpdateEntity(bio, dto);
        await _unitOfWork.CompleteAsync();

        return BioMapper.ToDto(bio);
    }
}
