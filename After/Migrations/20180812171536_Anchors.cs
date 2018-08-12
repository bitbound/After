using Microsoft.EntityFrameworkCore.Migrations;

namespace After.Migrations
{
    public partial class Anchors : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "AnchorX",
                table: "GameObjects",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "AnchorY",
                table: "GameObjects",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "AnchorZ",
                table: "GameObjects",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AnchorX",
                table: "GameObjects");

            migrationBuilder.DropColumn(
                name: "AnchorY",
                table: "GameObjects");

            migrationBuilder.DropColumn(
                name: "AnchorZ",
                table: "GameObjects");
        }
    }
}
