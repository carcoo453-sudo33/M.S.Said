using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Portfolio.API.Application.Features.Notifications.Services;
using Portfolio.API.Application.Features.Reactions.DTOs;
using Portfolio.API.Application.Features.Reactions.Services;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using System;
using System.Threading.Tasks;
using Xunit;

namespace Portfolio.API.Tests.Application.Features.Reactions.Services;

public class ReactionServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<INotificationService> _mockNotificationService;
    private readonly Mock<ILogger<ReactionService>> _mockLogger;
    private readonly ReactionService _reactionService;
    private readonly Mock<IGenericRepository<Project>> _mockProjectRepo;
    private readonly Mock<IGenericRepository<Reaction>> _mockReactionRepo;

    public ReactionServiceTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockNotificationService = new Mock<INotificationService>();
        _mockLogger = new Mock<ILogger<ReactionService>>();
        _mockProjectRepo = new Mock<IGenericRepository<Project>>();
        _mockReactionRepo = new Mock<IGenericRepository<Reaction>>();

        _mockUnitOfWork.Setup(u => u.Repository<Project>()).Returns(_mockProjectRepo.Object);
        _mockUnitOfWork.Setup(u => u.Repository<Reaction>()).Returns(_mockReactionRepo.Object);

        _reactionService = new ReactionService(
            _mockUnitOfWork.Object,
            _mockNotificationService.Object,
            _mockLogger.Object);
    }

    [Fact]
    public async Task AddReactionAsync_OnDuplicateReaction_ThrowsArgumentException()
    {
        // Arrange
        var projectId = Guid.NewGuid();
        var request = new ReactionCreateDto { UserId = "user1", ReactionType = "Like" };
        var project = new Project { Id = projectId, Title = "Test Project" };

        _mockProjectRepo.Setup(r => r.GetByIdAsync(projectId)).ReturnsAsync(project);
        
        // Simulate DbUpdateException which happens when the Unique Constraint (ProjectId, UserId) is violated
        _mockUnitOfWork.Setup(u => u.CompleteAsync(It.IsAny<System.Threading.CancellationToken>()))
            .ThrowsAsync(new DbUpdateException("Duplicate key violation"));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(() => _reactionService.AddReactionAsync(projectId, request));
        Assert.Equal("User has already reacted to this project", exception.Message);

        // Ensure reaction count does NOT increment on failure
        Assert.Equal(0, project.ReactionsCount);
    }

    [Fact]
    public async Task AddReactionAsync_OnSuccess_IncrementsReactionCount()
    {
        // Arrange
        var projectId = Guid.NewGuid();
        var request = new ReactionCreateDto { UserId = "user1", ReactionType = "Like" };
        var project = new Project { Id = projectId, Title = "Test Project", ReactionsCount = 5 };

        _mockProjectRepo.Setup(r => r.GetByIdAsync(projectId)).ReturnsAsync(project);
        
        // Act
        var result = await _reactionService.AddReactionAsync(projectId, request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(6, project.ReactionsCount); // 5 + 1
        _mockUnitOfWork.Verify(u => u.CompleteAsync(It.IsAny<System.Threading.CancellationToken>()), Times.Exactly(2));
        _mockNotificationService.Verify(n => n.CreateNotificationAsync(
             It.IsAny<string>(), 
             It.IsAny<string>(), 
             It.IsAny<string>(), 
             It.IsAny<string>(), 
             It.IsAny<string>(), 
             It.IsAny<string>(), 
             It.IsAny<string>(), 
             It.IsAny<string>(),
             It.IsAny<string>()), Times.Once);
    }
}
