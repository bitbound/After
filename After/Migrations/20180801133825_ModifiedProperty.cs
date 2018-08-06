using Microsoft.EntityFrameworkCore.Migrations;

namespace After.Migrations
{
    public partial class ModifiedProperty : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ModifiedThisGameLoop",
                table: "GameObjects",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ModifiedThisGameLoop",
                table: "GameObjects");
        }
    }
}
