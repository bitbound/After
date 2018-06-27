using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace After.Data.Migrations
{
    public partial class Characters : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PlayerCharacter",
                columns: table => new
                {
                    CoreEnergy = table.Column<double>(nullable: false),
                    CoreEnergyPeak = table.Column<double>(nullable: false),
                    CurrentCharge = table.Column<double>(nullable: false),
                    CurrentEnergy = table.Column<double>(nullable: false),
                    CurrentWillpower = table.Column<double>(nullable: false),
                    Height = table.Column<int>(nullable: false),
                    IsCollisionEnabled = table.Column<bool>(nullable: false),
                    MaxEnergyModifier = table.Column<double>(nullable: false),
                    MaxWillpowerModifier = table.Column<double>(nullable: false),
                    Width = table.Column<int>(nullable: false),
                    XCoord = table.Column<double>(nullable: false),
                    YCoord = table.Column<double>(nullable: false),
                    ZCoord = table.Column<double>(nullable: false),
                    Color = table.Column<string>(nullable: true),
                    PortraitUri = table.Column<string>(nullable: true),
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AfterUserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerCharacter", x => x.ID);
                    table.ForeignKey(
                        name: "FK_PlayerCharacter_AspNetUsers_AfterUserId",
                        column: x => x.AfterUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlayerCharacter_AfterUserId",
                table: "PlayerCharacter",
                column: "AfterUserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlayerCharacter");
        }
    }
}
