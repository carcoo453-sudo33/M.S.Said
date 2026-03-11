using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSocialMediaFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DevToUrl",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FacebookUrl",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PinterestUrl",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StackOverflowUrl",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DevToUrl",
                table: "BioEntries");

            migrationBuilder.DropColumn(
                name: "FacebookUrl",
                table: "BioEntries");

            migrationBuilder.DropColumn(
                name: "PinterestUrl",
                table: "BioEntries");

            migrationBuilder.DropColumn(
                name: "StackOverflowUrl",
                table: "BioEntries");
        }
    }
}
