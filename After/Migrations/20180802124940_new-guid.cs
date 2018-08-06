using Microsoft.EntityFrameworkCore.Migrations;

namespace After.Migrations
{
    public partial class newguid : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ModifiedThisGameLoop",
                table: "GameObjects",
                newName: "Modified");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Modified",
                table: "GameObjects",
                newName: "ModifiedThisGameLoop");
        }
    }
}
