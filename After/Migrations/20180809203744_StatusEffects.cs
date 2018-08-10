using Microsoft.EntityFrameworkCore.Migrations;

namespace After.Migrations
{
    public partial class StatusEffects : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Target",
                table: "StatusEffects");

            migrationBuilder.AddColumn<int>(
                name: "Timing",
                table: "StatusEffects",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Timing",
                table: "StatusEffects");

            migrationBuilder.AddColumn<int>(
                name: "Target",
                table: "StatusEffects",
                nullable: false,
                defaultValue: 0);
        }
    }
}
