using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTestimonialArabicFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Company_Ar",
                table: "Testimonials",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Content_Ar",
                table: "Testimonials",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Role_Ar",
                table: "Testimonials",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Company_Ar",
                table: "Testimonials");

            migrationBuilder.DropColumn(
                name: "Content_Ar",
                table: "Testimonials");

            migrationBuilder.DropColumn(
                name: "Role_Ar",
                table: "Testimonials");
        }
    }
}
