using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.API.Migrations
{
    /// <inheritdoc />
    public partial class CleanupOldTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop all old/obsolete tables that are no longer in the current model
            migrationBuilder.Sql(@"
                IF OBJECT_ID(N'[dbo].[AspNetUserLogins]', N'U') IS NOT NULL
                    DROP TABLE [dbo].[AspNetUserLogins];
                
                IF OBJECT_ID(N'[dbo].[AspNetUserTokens]', N'U') IS NOT NULL
                    DROP TABLE [dbo].[AspNetUserTokens];
                
                IF OBJECT_ID(N'[dbo].[AspNetUserClaims]', N'U') IS NOT NULL
                    DROP TABLE [dbo].[AspNetUserClaims];
                
                IF OBJECT_ID(N'[dbo].[AspNetRoleClaims]', N'U') IS NOT NULL
                    DROP TABLE [dbo].[AspNetRoleClaims];
                
                IF OBJECT_ID(N'[dbo].[AspNetUserRoles]', N'U') IS NOT NULL
                    DROP TABLE [dbo].[AspNetUserRoles];
                
                IF OBJECT_ID(N'[dbo].[AspNetUsers]', N'U') IS NOT NULL
                    DROP TABLE [dbo].[AspNetUsers];
                
                IF OBJECT_ID(N'[dbo].[AspNetRoles]', N'U') IS NOT NULL
                    DROP TABLE [dbo].[AspNetRoles];
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
