using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.API.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveOrderFromSkills : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Order",
                table: "Skills");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Skills",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
