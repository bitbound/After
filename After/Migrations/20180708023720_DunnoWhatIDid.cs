using Microsoft.EntityFrameworkCore.Migrations;

namespace After.Migrations
{
    public partial class DunnoWhatIDid : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DeccelerationSpeed",
                table: "GameObjects",
                newName: "DecelerationSpeed");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DecelerationSpeed",
                table: "GameObjects",
                newName: "DeccelerationSpeed");
        }
    }
}
