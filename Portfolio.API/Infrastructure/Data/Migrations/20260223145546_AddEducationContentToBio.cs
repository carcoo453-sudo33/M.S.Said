using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddEducationContentToBio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EducationQuote",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TechnicalFocusDescription",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TechnicalFocusItems",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TechnicalFocusTitle",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EducationQuote",
                table: "BioEntries");

            migrationBuilder.DropColumn(
                name: "TechnicalFocusDescription",
                table: "BioEntries");

            migrationBuilder.DropColumn(
                name: "TechnicalFocusItems",
                table: "BioEntries");

            migrationBuilder.DropColumn(
                name: "TechnicalFocusTitle",
                table: "BioEntries");
        }
    }
}
