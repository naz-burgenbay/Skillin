using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Skillin.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddApplicationCvPath : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CvPath",
                table: "Applications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CvPath",
                table: "Applications");
        }
    }
}
