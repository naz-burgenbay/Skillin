using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Skillin.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingRows : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UniversityName",
                table: "StudentProfiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UniversityName",
                table: "StudentProfiles");
        }
    }
}
