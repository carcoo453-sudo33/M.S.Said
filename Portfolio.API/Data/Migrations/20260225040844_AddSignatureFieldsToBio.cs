using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSignatureFieldsToBio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SignatureRole",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SignatureRole_Ar",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SignatureSubtitle",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SignatureSubtitle_Ar",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SignatureRole",
                table: "BioEntries");

            migrationBuilder.DropColumn(
                name: "SignatureRole_Ar",
                table: "BioEntries");

            migrationBuilder.DropColumn(
                name: "SignatureSubtitle",
                table: "BioEntries");

            migrationBuilder.DropColumn(
                name: "SignatureSubtitle_Ar",
                table: "BioEntries");
        }
    }
}
