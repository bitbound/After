using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace After.Migrations
{
    public partial class ExpandStatusEffect : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Expiration",
                table: "GameObjects");

            migrationBuilder.DropColumn(
                name: "Owner",
                table: "GameObjects");

            migrationBuilder.AddColumn<DateTime>(
                name: "Expiration",
                table: "StatusEffects",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<TimeSpan>(
                name: "Interval",
                table: "StatusEffects",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<DateTime>(
                name: "LastTick",
                table: "StatusEffects",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "StatusEffects",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Expiration",
                table: "StatusEffects");

            migrationBuilder.DropColumn(
                name: "Interval",
                table: "StatusEffects");

            migrationBuilder.DropColumn(
                name: "LastTick",
                table: "StatusEffects");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "StatusEffects");

            migrationBuilder.AddColumn<DateTime>(
                name: "Expiration",
                table: "GameObjects",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "Owner",
                table: "GameObjects",
                nullable: true);
        }
    }
}
