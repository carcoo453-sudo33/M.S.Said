using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveIsTrendyFromProjects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF EXISTS(SELECT 1 FROM sys.columns 
                          WHERE Name = N'IsTrendy'
                          AND Object_ID = Object_ID(N'dbo.Projects'))
                BEGIN
                    ALTER TABLE dbo.Projects DROP COLUMN IsTrendy;
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsTrendy",
                table: "Projects",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
