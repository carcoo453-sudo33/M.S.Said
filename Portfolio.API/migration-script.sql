IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    CREATE TABLE [AspNetRoles] (
        [Id] nvarchar(450) NOT NULL,
        [Name] nvarchar(256) NULL,
        [NormalizedName] nvarchar(256) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    CREATE TABLE [AspNetUsers] (
        [Id] nvarchar(450) NOT NULL,
        [UserName] nvarchar(256) NULL,
        [NormalizedUserName] nvarchar(256) NULL,
        [Email] nvarchar(256) NULL,
        [NormalizedEmail] nvarchar(256) NULL,
        [EmailConfirmed] bit NOT NULL,
        [PasswordHash] nvarchar(max) NULL,
        [SecurityStamp] nvarchar(max) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        [PhoneNumber] nvarchar(max) NULL,
        [PhoneNumberConfirmed] bit NOT NULL,
        [TwoFactorEnabled] bit NOT NULL,
        [LockoutEnd] datetimeoffset NULL,
        [LockoutEnabled] bit NOT NULL,
        [AccessFailedCount] int NOT NULL,
        CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    CREATE TABLE [BioEntries] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Location] nvarchar(max) NOT NULL,
        [Email] nvarchar(max) NOT NULL,
        [Phone] nvarchar(max) NOT NULL,
        [AvatarUrl] nvarchar(max) NULL,
        [YearsOfExperience] nvarchar(max) NOT NULL,
        [ProjectsCompleted] nvarchar(max) NOT NULL,
        [CodeCommits] nvarchar(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_BioEntries] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    CREATE TABLE [BlogPosts] (
        [Id] uniqueidentifier NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Summary] nvarchar(max) NOT NULL,
        [Content] nvarchar(max) NOT NULL,
        [ImageUrl] nvarchar(max) NULL,
        [PublishedAt] datetime2 NOT NULL,
        [Tags] nvarchar(max) NULL,
        [Author] nvarchar(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_BlogPosts] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    CREATE TABLE [ContactMessages] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Email] nvarchar(max) NOT NULL,
        [Subject] nvarchar(max) NOT NULL,
        [Message] nvarchar(max) NOT NULL,
        [SentAt] datetime2 NOT NULL,
        [IsRead] bit NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_ContactMessages] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    CREATE TABLE [EducationEntries] (
        [Id] uniqueidentifier NOT NULL,
        [Institution] nvarchar(max) NOT NULL,
        [Degree] nvarchar(max) NOT NULL,
        [Duration] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NULL,
        [Location] nvarchar(max) NULL,
        [IsCompleted] bit NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_EducationEntries] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    CREATE TABLE [Experiences] (
        [Id] uniqueidentifier NOT NULL,
        [Company] nvarchar(max) NOT NULL,
        [Role] nvarchar(max) NOT NULL,
        [Duration] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NULL,
        [Location] nvarchar(max) NULL,
        [IsCurrent] bit NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_Experiences] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    CREATE TABLE [Projects] (
        [Id] uniqueidentifier NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NULL,
        [TechStack] nvarchar(max) NULL,
        [ImageUrl] nvarchar(max) NULL,
        [DemoUrl] nvarchar(max) NULL,
        [RepoUrl] nvarchar(max) NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_Projects] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    CREATE TABLE [ServiceEntries] (
        [Id] uniqueidentifier NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Icon] nvarchar(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_ServiceEntries] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    CREATE TABLE [AspNetRoleClaims] (
        [Id] int NOT NULL IDENTITY,
        [RoleId] nvarchar(450) NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    CREATE TABLE [AspNetUserClaims] (
        [Id] int NOT NULL IDENTITY,
        [UserId] nvarchar(450) NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    CREATE TABLE [AspNetUserLogins] (
        [LoginProvider] nvarchar(450) NOT NULL,
        [ProviderKey] nvarchar(450) NOT NULL,
        [ProviderDisplayName] nvarchar(max) NULL,
        [UserId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
        CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    CREATE TABLE [AspNetUserRoles] (
        [UserId] nvarchar(450) NOT NULL,
        [RoleId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
        CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    CREATE TABLE [AspNetUserTokens] (
        [UserId] nvarchar(450) NOT NULL,
        [LoginProvider] nvarchar(450) NOT NULL,
        [Name] nvarchar(450) NOT NULL,
        [Value] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
        CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222230619_InitialFullSet'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260222230619_InitialFullSet', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222233514_UpdateBioFields'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [CVUrl] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222233514_UpdateBioFields'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [GitHubUrl] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222233514_UpdateBioFields'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [LinkedInUrl] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222233514_UpdateBioFields'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [TwitterUrl] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222233514_UpdateBioFields'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [WhatsAppUrl] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222233514_UpdateBioFields'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260222233514_UpdateBioFields', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222235827_AddProjectFields'
)
BEGIN
    ALTER TABLE [Projects] ADD [Category] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222235827_AddProjectFields'
)
BEGIN
    ALTER TABLE [Projects] ADD [Duration] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222235827_AddProjectFields'
)
BEGIN
    ALTER TABLE [Projects] ADD [Niche] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222235827_AddProjectFields'
)
BEGIN
    ALTER TABLE [Projects] ADD [Slug] nvarchar(max) NOT NULL DEFAULT N'';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222235827_AddProjectFields'
)
BEGIN
    ALTER TABLE [Projects] ADD [Tags] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222235827_AddProjectFields'
)
BEGIN
    CREATE TABLE [Skills] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Icon] nvarchar(max) NULL,
        [Order] int NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_Skills] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260222235827_AddProjectFields'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260222235827_AddProjectFields', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223000402_AddBlogSocialFields'
)
BEGIN
    ALTER TABLE [BlogPosts] ADD [SocialType] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223000402_AddBlogSocialFields'
)
BEGIN
    ALTER TABLE [BlogPosts] ADD [SocialUrl] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223000402_AddBlogSocialFields'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260223000402_AddBlogSocialFields', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223015825_AddMissingFieldsAndSkills'
)
BEGIN
    ALTER TABLE [BlogPosts] ADD [CommentsCount] int NOT NULL DEFAULT 0;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223015825_AddMissingFieldsAndSkills'
)
BEGIN
    ALTER TABLE [BlogPosts] ADD [ForksCount] int NOT NULL DEFAULT 0;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223015825_AddMissingFieldsAndSkills'
)
BEGIN
    ALTER TABLE [BlogPosts] ADD [LikesCount] int NOT NULL DEFAULT 0;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223015825_AddMissingFieldsAndSkills'
)
BEGIN
    ALTER TABLE [BlogPosts] ADD [StarsCount] int NOT NULL DEFAULT 0;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223015825_AddMissingFieldsAndSkills'
)
BEGIN
    ALTER TABLE [BlogPosts] ADD [Version] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223015825_AddMissingFieldsAndSkills'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260223015825_AddMissingFieldsAndSkills', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223062610_AddOrderAndIsFeaturedToProjects'
)
BEGIN
    ALTER TABLE [Projects] ADD [IsFeatured] bit NOT NULL DEFAULT CAST(0 AS bit);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223062610_AddOrderAndIsFeaturedToProjects'
)
BEGIN
    ALTER TABLE [Projects] ADD [Order] int NOT NULL DEFAULT 0;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223062610_AddOrderAndIsFeaturedToProjects'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260223062610_AddOrderAndIsFeaturedToProjects', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223071043_ExpandProjectModels'
)
BEGIN
    ALTER TABLE [Projects] ADD [Architecture] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223071043_ExpandProjectModels'
)
BEGIN
    ALTER TABLE [Projects] ADD [GalleryJson] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223071043_ExpandProjectModels'
)
BEGIN
    ALTER TABLE [Projects] ADD [Language] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223071043_ExpandProjectModels'
)
BEGIN
    ALTER TABLE [Projects] ADD [ReactionsCount] int NOT NULL DEFAULT 0;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223071043_ExpandProjectModels'
)
BEGIN
    ALTER TABLE [Projects] ADD [ResponsibilitiesJson] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223071043_ExpandProjectModels'
)
BEGIN
    ALTER TABLE [Projects] ADD [Status] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223071043_ExpandProjectModels'
)
BEGIN
    ALTER TABLE [Projects] ADD [Summary] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223071043_ExpandProjectModels'
)
BEGIN
    ALTER TABLE [Projects] ADD [Views] int NOT NULL DEFAULT 0;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223071043_ExpandProjectModels'
)
BEGIN
    CREATE TABLE [ProjectChangelogItems] (
        [Id] uniqueidentifier NOT NULL,
        [ProjectEntryId] uniqueidentifier NOT NULL,
        [Date] nvarchar(max) NOT NULL,
        [Version] nvarchar(max) NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_ProjectChangelogItems] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ProjectChangelogItems_Projects_ProjectEntryId] FOREIGN KEY ([ProjectEntryId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223071043_ExpandProjectModels'
)
BEGIN
    CREATE TABLE [ProjectComments] (
        [Id] uniqueidentifier NOT NULL,
        [ProjectEntryId] uniqueidentifier NOT NULL,
        [Author] nvarchar(max) NOT NULL,
        [AvatarUrl] nvarchar(max) NULL,
        [Date] nvarchar(max) NOT NULL,
        [Content] nvarchar(max) NOT NULL,
        [Likes] int NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_ProjectComments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ProjectComments_Projects_ProjectEntryId] FOREIGN KEY ([ProjectEntryId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223071043_ExpandProjectModels'
)
BEGIN
    CREATE TABLE [ProjectKeyFeatures] (
        [Id] uniqueidentifier NOT NULL,
        [ProjectEntryId] uniqueidentifier NOT NULL,
        [Icon] nvarchar(max) NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_ProjectKeyFeatures] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ProjectKeyFeatures_Projects_ProjectEntryId] FOREIGN KEY ([ProjectEntryId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223071043_ExpandProjectModels'
)
BEGIN
    CREATE TABLE [ProjectMetrics] (
        [Id] uniqueidentifier NOT NULL,
        [ProjectEntryId] uniqueidentifier NOT NULL,
        [Label] nvarchar(max) NOT NULL,
        [Value] nvarchar(max) NOT NULL,
        [Trend] nvarchar(max) NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_ProjectMetrics] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ProjectMetrics_Projects_ProjectEntryId] FOREIGN KEY ([ProjectEntryId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223071043_ExpandProjectModels'
)
BEGIN
    CREATE INDEX [IX_ProjectChangelogItems_ProjectEntryId] ON [ProjectChangelogItems] ([ProjectEntryId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223071043_ExpandProjectModels'
)
BEGIN
    CREATE INDEX [IX_ProjectComments_ProjectEntryId] ON [ProjectComments] ([ProjectEntryId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223071043_ExpandProjectModels'
)
BEGIN
    CREATE INDEX [IX_ProjectKeyFeatures_ProjectEntryId] ON [ProjectKeyFeatures] ([ProjectEntryId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223071043_ExpandProjectModels'
)
BEGIN
    CREATE INDEX [IX_ProjectMetrics_ProjectEntryId] ON [ProjectMetrics] ([ProjectEntryId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223071043_ExpandProjectModels'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260223071043_ExpandProjectModels', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223140931_AddCategoryToEducation'
)
BEGIN
    ALTER TABLE [EducationEntries] ADD [Category] nvarchar(max) NOT NULL DEFAULT N'Education';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223140931_AddCategoryToEducation'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260223140931_AddCategoryToEducation', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223145546_AddEducationContentToBio'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [EducationQuote] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223145546_AddEducationContentToBio'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [TechnicalFocusDescription] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223145546_AddEducationContentToBio'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [TechnicalFocusItems] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223145546_AddEducationContentToBio'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [TechnicalFocusTitle] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223145546_AddEducationContentToBio'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260223145546_AddEducationContentToBio', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223151919_AddClientsAndTestimonials'
)
BEGIN
    CREATE TABLE [Clients] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [LogoUrl] nvarchar(max) NULL,
        [Order] int NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_Clients] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223151919_AddClientsAndTestimonials'
)
BEGIN
    CREATE TABLE [Testimonials] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Role] nvarchar(max) NOT NULL,
        [Content] nvarchar(max) NOT NULL,
        [Company] nvarchar(max) NULL,
        [AvatarUrl] nvarchar(max) NULL,
        [Order] int NOT NULL,
        [IsFeatured] bit NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_Testimonials] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223151919_AddClientsAndTestimonials'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260223151919_AddClientsAndTestimonials', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [ServiceEntries] ADD [Description_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [ServiceEntries] ADD [Title_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [Projects] ADD [Category_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [Projects] ADD [Description_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [Projects] ADD [Niche_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [Projects] ADD [Summary_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [Projects] ADD [Tags_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [Projects] ADD [Title_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [ProjectMetrics] ADD [Label_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [ProjectKeyFeatures] ADD [Description_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [ProjectKeyFeatures] ADD [Title_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [ProjectChangelogItems] ADD [Description_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [ProjectChangelogItems] ADD [Title_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [Experiences] ADD [Company_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [Experiences] ADD [Description_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [Experiences] ADD [Location_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [Experiences] ADD [Role_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [EducationEntries] ADD [Degree_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [EducationEntries] ADD [Description_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [EducationEntries] ADD [Institution_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [EducationEntries] ADD [Location_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [Description_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [EducationQuote_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [Location_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [Name_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [TechnicalFocusDescription_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [TechnicalFocusItems_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [TechnicalFocusTitle_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [Title_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224021615_AddTranslationFields'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260224021615_AddTranslationFields', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225000557_AddNotificationsTable'
)
BEGIN
    CREATE TABLE [Notifications] (
        [Id] uniqueidentifier NOT NULL,
        [Type] nvarchar(max) NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Message] nvarchar(max) NOT NULL,
        [Link] nvarchar(max) NULL,
        [Icon] nvarchar(max) NULL,
        [IsRead] bit NOT NULL,
        [RelatedEntityId] nvarchar(max) NULL,
        [RelatedEntityType] nvarchar(max) NULL,
        [SenderName] nvarchar(max) NULL,
        [SenderEmail] nvarchar(max) NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_Notifications] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225000557_AddNotificationsTable'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260225000557_AddNotificationsTable', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225040844_AddSignatureFieldsToBio'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [SignatureRole] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225040844_AddSignatureFieldsToBio'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [SignatureRole_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225040844_AddSignatureFieldsToBio'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [SignatureSubtitle] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225040844_AddSignatureFieldsToBio'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [SignatureSubtitle_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225040844_AddSignatureFieldsToBio'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260225040844_AddSignatureFieldsToBio', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225041244_AddSignatureRoleAndSubtitle'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260225041244_AddSignatureRoleAndSubtitle', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225042011_AddSignatureNameAndVerifiedText'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [SignatureName] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225042011_AddSignatureNameAndVerifiedText'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [SignatureName_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225042011_AddSignatureNameAndVerifiedText'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [SignatureVerifiedText] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225042011_AddSignatureNameAndVerifiedText'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [SignatureVerifiedText_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225042011_AddSignatureNameAndVerifiedText'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260225042011_AddSignatureNameAndVerifiedText', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225043823_AddTestimonialArabicFields'
)
BEGIN
    ALTER TABLE [Testimonials] ADD [Company_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225043823_AddTestimonialArabicFields'
)
BEGIN
    ALTER TABLE [Testimonials] ADD [Content_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225043823_AddTestimonialArabicFields'
)
BEGIN
    ALTER TABLE [Testimonials] ADD [Role_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225043823_AddTestimonialArabicFields'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260225043823_AddTestimonialArabicFields', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225045258_AddBlogArabicFields'
)
BEGIN
    ALTER TABLE [BlogPosts] ADD [Content_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225045258_AddBlogArabicFields'
)
BEGIN
    ALTER TABLE [BlogPosts] ADD [Summary_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225045258_AddBlogArabicFields'
)
BEGIN
    ALTER TABLE [BlogPosts] ADD [Tags_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225045258_AddBlogArabicFields'
)
BEGIN
    ALTER TABLE [BlogPosts] ADD [Title_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225045258_AddBlogArabicFields'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260225045258_AddBlogArabicFields', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225071325_AddSocialMediaFields'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [DevToUrl] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225071325_AddSocialMediaFields'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [FacebookUrl] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225071325_AddSocialMediaFields'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [PinterestUrl] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225071325_AddSocialMediaFields'
)
BEGIN
    ALTER TABLE [BioEntries] ADD [StackOverflowUrl] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225071325_AddSocialMediaFields'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260225071325_AddSocialMediaFields', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225225546_AddImageUrlToEducation'
)
BEGIN
    ALTER TABLE [EducationEntries] ADD [ImageUrl] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260225225546_AddImageUrlToEducation'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260225225546_AddImageUrlToEducation', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260226175123_AddMetadataArFields'
)
BEGIN
    ALTER TABLE [Projects] ADD [Architecture_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260226175123_AddMetadataArFields'
)
BEGIN
    ALTER TABLE [Projects] ADD [Duration_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260226175123_AddMetadataArFields'
)
BEGIN
    ALTER TABLE [Projects] ADD [Language_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260226175123_AddMetadataArFields'
)
BEGIN
    ALTER TABLE [Projects] ADD [Status_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260226175123_AddMetadataArFields'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260226175123_AddMetadataArFields', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260226190609_AddNameArToSkills'
)
BEGIN
    DROP TABLE [ProjectMetrics];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260226190609_AddNameArToSkills'
)
BEGIN
    ALTER TABLE [Skills] ADD [Name_Ar] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260226190609_AddNameArToSkills'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260226190609_AddNameArToSkills', N'9.0.0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260227154602_AddIsTrendyToProjects'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260227154602_AddIsTrendyToProjects', N'9.0.0');
END;

COMMIT;
GO

