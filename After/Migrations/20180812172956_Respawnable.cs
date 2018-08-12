using Microsoft.EntityFrameworkCore.Migrations;

namespace After.Migrations
{
    public partial class Respawnable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRespawnable",
                table: "GameObjects",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRespawnable",
                table: "GameObjects");
        }
    }
}
