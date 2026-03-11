using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTranslationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description_Ar",
                table: "ServiceEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title_Ar",
                table: "ServiceEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Category_Ar",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description_Ar",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Niche_Ar",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Summary_Ar",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Tags_Ar",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title_Ar",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Label_Ar",
                table: "ProjectMetrics",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description_Ar",
                table: "ProjectKeyFeatures",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title_Ar",
                table: "ProjectKeyFeatures",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description_Ar",
                table: "ProjectChangelogItems",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title_Ar",
                table: "ProjectChangelogItems",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Company_Ar",
                table: "Experiences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description_Ar",
                table: "Experiences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Location_Ar",
                table: "Experiences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Role_Ar",
                table: "Experiences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Degree_Ar",
                table: "EducationEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description_Ar",
                table: "EducationEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Institution_Ar",
                table: "EducationEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Location_Ar",
                table: "EducationEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description_Ar",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EducationQuote_Ar",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Location_Ar",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name_Ar",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TechnicalFocusDescription_Ar",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TechnicalFocusItems_Ar",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TechnicalFocusTitle_Ar",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title_Ar",
                table: "BioEntries",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description_Ar",
                table: "ServiceEntries");

            migrationBuilder.DropColumn(
                name: "Title_Ar",
                table: "ServiceEntries");

            migrationBuilder.DropColumn(
                name: "Category_Ar",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Description_Ar",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Niche_Ar",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Summary_Ar",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Tags_Ar",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Title_Ar",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Label_Ar",
                table: "ProjectMetrics");

            migrationBuilder.DropColumn(
                name: "Description_Ar",
                table: "ProjectKeyFeatures");

            migrationBuilder.DropColumn(
                name: "Title_Ar",
                table: "ProjectKeyFeatures");

            migrationBuilder.DropColumn(
                name: "Description_Ar",
                table: "ProjectChangelogItems");

            migrationBuilder.DropColumn(
                name: "Title_Ar",
                table: "ProjectChangelogItems");

            migrationBuilder.DropColumn(
                name: "Company_Ar",
                table: "Experiences");

            migrationBuilder.DropColumn(
                name: "Description_Ar",
                table: "Experiences");

            migrationBuilder.DropColumn(
                name: "Location_Ar",
                table: "Experiences");

            migrationBuilder.DropColumn(
                name: "Role_Ar",
                table: "Experiences");

            migrationBuilder.DropColumn(
                name: "Degree_Ar",
                table: "EducationEntries");

            migrationBuilder.DropColumn(
                name: "Description_Ar",
                table: "EducationEntries");

            migrationBuilder.DropColumn(
                name: "Institution_Ar",
                table: "EducationEntries");

            migrationBuilder.DropColumn(
                name: "Location_Ar",
                table: "EducationEntries");

            migrationBuilder.DropColumn(
                name: "Description_Ar",
                table: "BioEntries");

            migrationBuilder.DropColumn(
                name: "EducationQuote_Ar",
                table: "BioEntries");

            migrationBuilder.DropColumn(
                name: "Location_Ar",
                table: "BioEntries");

            migrationBuilder.DropColumn(
                name: "Name_Ar",
                table: "BioEntries");

            migrationBuilder.DropColumn(
                name: "TechnicalFocusDescription_Ar",
                table: "BioEntries");

            migrationBuilder.DropColumn(
                name: "TechnicalFocusItems_Ar",
                table: "BioEntries");

            migrationBuilder.DropColumn(
                name: "TechnicalFocusTitle_Ar",
                table: "BioEntries");

            migrationBuilder.DropColumn(
                name: "Title_Ar",
                table: "BioEntries");
        }
    }
}
