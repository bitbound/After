using Microsoft.EntityFrameworkCore.Migrations;

namespace After.Migrations
{
    public partial class _20180728 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StatusEffect_GameObjects_PlayerCharacterID",
                table: "StatusEffect");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StatusEffect",
                table: "StatusEffect");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ErrorLog",
                table: "ErrorLog");

            migrationBuilder.RenameTable(
                name: "StatusEffect",
                newName: "StatusEffects");

            migrationBuilder.RenameTable(
                name: "ErrorLog",
                newName: "Errors");

            migrationBuilder.RenameIndex(
                name: "IX_StatusEffect_PlayerCharacterID",
                table: "StatusEffects",
                newName: "IX_StatusEffects_PlayerCharacterID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StatusEffects",
                table: "StatusEffects",
                column: "ID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Errors",
                table: "Errors",
                column: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_StatusEffects_GameObjects_PlayerCharacterID",
                table: "StatusEffects",
                column: "PlayerCharacterID",
                principalTable: "GameObjects",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StatusEffects_GameObjects_PlayerCharacterID",
                table: "StatusEffects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StatusEffects",
                table: "StatusEffects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Errors",
                table: "Errors");

            migrationBuilder.RenameTable(
                name: "StatusEffects",
                newName: "StatusEffect");

            migrationBuilder.RenameTable(
                name: "Errors",
                newName: "ErrorLog");

            migrationBuilder.RenameIndex(
                name: "IX_StatusEffects_PlayerCharacterID",
                table: "StatusEffect",
                newName: "IX_StatusEffect_PlayerCharacterID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StatusEffect",
                table: "StatusEffect",
                column: "ID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ErrorLog",
                table: "ErrorLog",
                column: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_StatusEffect_GameObjects_PlayerCharacterID",
                table: "StatusEffect",
                column: "PlayerCharacterID",
                principalTable: "GameObjects",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
