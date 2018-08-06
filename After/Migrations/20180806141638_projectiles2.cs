using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace After.Migrations
{
    public partial class projectiles2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Expiration",
                table: "GameObjects",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "Owner",
                table: "GameObjects",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Expiration",
                table: "GameObjects");

            migrationBuilder.DropColumn(
                name: "Owner",
                table: "GameObjects");
        }
    }
}
