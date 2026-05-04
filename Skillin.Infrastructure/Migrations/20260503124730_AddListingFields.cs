using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Skillin.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddListingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Duration",
                table: "Listings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Requirements",
                table: "Listings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Listings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "Requirements",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Listings");
        }
    }
}
