## Description

This PR refactors the Portfolio API to implement proper feature separation and clean architecture principles. It separates Comments and Reactions into independent features with their own complete service layers, removes redundant code, and fixes security vulnerabilities.

**Key Changes:**
- Separated Comments feature from Projects with dedicated DTOs, Mappers, Services, Queries, and Validation
- Created new Reactions feature with complete service structure (DTOs, Mappers, Services, Validation)
- Removed duplicate validation files and comment-related code from Projects feature
- Updated DbContext to use clean entity names (Project, Bio, Comment, Reaction, etc.)
- Fixed SQL injection vulnerability in DatabaseConfiguration
- Moved GitHubImportDto to Projects DTOs folder for proper organization

Fixes #N/A (Architectural improvement - no specific issue)

## Type of change

- [x] New feature (non-breaking change which adds functionality)
- [x] Breaking change (refactoring that improves architecture)
- [x] This change requires a documentation update (.md files or Swagger)

## Architecture Changes

### Before
```
Projects Feature
├── DTOs (including Comments)
├── Mappers (including CommentMapper)
├── Services (including comment logic)
└── Validation (including CommentValidation)
```

### After
```
Projects Feature
├── DTOs (project-specific only)
├── Mappers (ProjectMapper, KeyFeatureMapper, ChangelogItemMapper)
├── Queries (6 query handlers)
├── Services (ProjectService)
└── Validation (ProjectValidation)

Comments Feature (NEW)
├── DTOs (CommentDto, CommentCreateDto, ReplyDto)
├── Mappers (CommentMapper)
├── Services (CommentService, ICommentService)
└── Validation (CommentValidation)

Reactions Feature (NEW)
├── DTOs (ReactionDto, ReactionCreateDto)
├── Mappers (ReactionMapper)
├── Services (ReactionService, IReactionService)
└── Validation (ReactionValidation)
```

## How Has This Been Tested?

- [x] Checked for .NET compilation errors (`dotnet build`)
- [x] Verified no new warnings in console/terminal
- [x] All diagnostics pass with no errors
- [x] Git history clean with proper commits
- [x] Code follows project style guidelines

## Files Modified

### Core Changes
- `Portfolio.API/Application/Features/Projects/Services/ProjectService.cs` - Removed ReactToProjectAsync
- `Portfolio.API/Application/Features/Projects/Services/IProjectService.cs` - Removed ReactToProjectAsync interface
- `Portfolio.API/Controllers/ProjectsController.cs` - Updated to use ICommentService and IReactionService
- `Portfolio.API/Infrastructure/Configuration/ServiceRegistration.cs` - Registered new services
- `Portfolio.API/Infrastructure/Data/PortfolioDbContext.cs` - Updated entity names and relationships

### New Files Created
- `Portfolio.API/Application/Features/Comments/DTOs/CommentDto.cs`
- `Portfolio.API/Application/Features/Comments/DTOs/CommentCreateDto.cs`
- `Portfolio.API/Application/Features/Comments/DTOs/ReplyDto.cs`
- `Portfolio.API/Application/Features/Comments/Mappers/CommentMapper.cs`
- `Portfolio.API/Application/Features/Comments/Services/ICommentService.cs`
- `Portfolio.API/Application/Features/Comments/Services/CommentService.cs`
- `Portfolio.API/Application/Features/Comments/Validation/CommentValidation.cs`
- `Portfolio.API/Application/Features/Reactions/DTOs/ReactionDto.cs`
- `Portfolio.API/Application/Features/Reactions/DTOs/ReactionCreateDto.cs`
- `Portfolio.API/Application/Features/Reactions/Mappers/ReactionMapper.cs`
- `Portfolio.API/Application/Features/Reactions/Services/IReactionService.cs`
- `Portfolio.API/Application/Features/Reactions/Services/ReactionService.cs`
- `Portfolio.API/Application/Features/Reactions/Validation/ReactionValidation.cs`
- `Portfolio.API/Application/Features/Projects/DTOs/GitHubImportDto.cs`

### Files Deleted
- `Portfolio.API/Application/Features/Projects/Validation/CommentValidation.cs` (duplicate)

### Security Fixes
- `Portfolio.API/Infrastructure/Configuration/DatabaseConfiguration.cs` - Replaced ExecuteSqlRawAsync with parameterized ExecuteSqlAsync to prevent SQL injection

## API Endpoint Changes

### New Endpoints
- `POST /api/projects/{projectId}/react` - Add reaction to project
- `DELETE /api/projects/{projectId}/react/{userId}` - Remove reaction from project
- `GET /api/projects/{projectId}/reactions` - Get all reactions for project

### Removed Endpoints
- `POST /api/projects/{projectId}/react` (old implementation) - Replaced with new ReactionService-based endpoint

## Breaking Changes

- `IProjectService.ReactToProjectAsync()` method removed - Use `IReactionService.AddReactionAsync()` instead
- ProjectDto no longer includes Comments collection - Comments are managed separately via ICommentService

## Checklist

- [x] My code follows the style guidelines of this project
- [x] I have performed a self-review of my own code
- [x] I have commented my code, particularly in hard-to-understand areas
- [x] My changes generate no new warnings in the console or terminal
- [x] All code compiles without errors
- [x] Git history is clean with descriptive commit messages
- [x] No duplicate code or files
- [x] Proper separation of concerns implemented

## Commits

1. `811447b` - refactor: separate comments from projects feature and remove duplicate validation
2. `b17cce9` - refactor: create reactions feature with proper service structure and update controllers
3. `6c54b09` - refactor: update DbContext to use new entity names and add Reaction relationships
4. `80c39ca` - fix: replace ExecuteSqlRawAsync with parameterized ExecuteSqlAsync to prevent SQL injection
5. `0877490` - refactor: move GitHubImportDto to Projects DTOs folder

## Notes for Reviewers

- This is a significant architectural refactoring that improves code organization and maintainability
- All changes are backward compatible at the database level (entity relationships preserved)
- The refactoring follows SOLID principles, particularly Single Responsibility Principle
- Each feature now has a complete, independent service layer
- Security vulnerability (SQL injection) has been fixed
- All code compiles and passes diagnostics

## Related Documentation

- See `docs/STRUCTURE.md` for updated project structure
- See `docs/FEATURES.md` for feature documentation
