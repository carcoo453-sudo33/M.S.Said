using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMetadataArFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Architecture_Ar",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Duration_Ar",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Language_Ar",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status_Ar",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Architecture_Ar",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Duration_Ar",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Language_Ar",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Status_Ar",
                table: "Projects");
        }
    }
}
