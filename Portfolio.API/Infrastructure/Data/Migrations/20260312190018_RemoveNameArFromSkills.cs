using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.API.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveNameArFromSkills : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name_Ar",
                table: "Skills");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name_Ar",
                table: "Skills",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
