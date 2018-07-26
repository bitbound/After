using Microsoft.EntityFrameworkCore.Migrations;

namespace After.Migrations
{
    public partial class ChargeProps : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "MaxChargeModifier",
                table: "GameObjects",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxChargeModifier",
                table: "GameObjects");
        }
    }
}
