using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSignatureNameAndVerifiedText : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SignatureName",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SignatureName_Ar",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SignatureVerifiedText",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SignatureVerifiedText_Ar",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SignatureName",
                table: "BioEntries");

            migrationBuilder.DropColumn(
                name: "SignatureName_Ar",
                table: "BioEntries");

            migrationBuilder.DropColumn(
                name: "SignatureVerifiedText",
                table: "BioEntries");

            migrationBuilder.DropColumn(
                name: "SignatureVerifiedText_Ar",
                table: "BioEntries");
        }
    }
}
