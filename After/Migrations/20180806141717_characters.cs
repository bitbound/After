using Microsoft.EntityFrameworkCore.Migrations;

namespace After.Migrations
{
    public partial class characters : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StatusEffects_GameObjects_PlayerCharacterID",
                table: "StatusEffects");

            migrationBuilder.RenameColumn(
                name: "PlayerCharacterID",
                table: "StatusEffects",
                newName: "CharacterID");

            migrationBuilder.RenameIndex(
                name: "IX_StatusEffects_PlayerCharacterID",
                table: "StatusEffects",
                newName: "IX_StatusEffects_CharacterID");

            migrationBuilder.AddForeignKey(
                name: "FK_StatusEffects_GameObjects_CharacterID",
                table: "StatusEffects",
                column: "CharacterID",
                principalTable: "GameObjects",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StatusEffects_GameObjects_CharacterID",
                table: "StatusEffects");

            migrationBuilder.RenameColumn(
                name: "CharacterID",
                table: "StatusEffects",
                newName: "PlayerCharacterID");

            migrationBuilder.RenameIndex(
                name: "IX_StatusEffects_CharacterID",
                table: "StatusEffects",
                newName: "IX_StatusEffects_PlayerCharacterID");

            migrationBuilder.AddForeignKey(
                name: "FK_StatusEffects_GameObjects_PlayerCharacterID",
                table: "StatusEffects",
                column: "PlayerCharacterID",
                principalTable: "GameObjects",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
