using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace After.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    SecurityStamp = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    Discriminator = table.Column<string>(nullable: false),
                    IsTemporary = table.Column<bool>(nullable: true),
                    LastLogin = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Errors",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PathWhereOccurred = table.Column<string>(nullable: true),
                    User = table.Column<string>(nullable: true),
                    Message = table.Column<string>(nullable: true),
                    StackTrace = table.Column<string>(nullable: true),
                    Source = table.Column<string>(nullable: true),
                    Timestamp = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Errors", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    RoleId = table.Column<string>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<string>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(maxLength: 128, nullable: false),
                    ProviderKey = table.Column<string>(maxLength: 128, nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    RoleId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    LoginProvider = table.Column<string>(maxLength: 128, nullable: false),
                    Name = table.Column<string>(maxLength: 128, nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GameObjects",
                columns: table => new
                {
                    AccelerationSpeed = table.Column<double>(nullable: false),
                    Color = table.Column<string>(nullable: true),
                    DecelerationSpeed = table.Column<double>(nullable: false),
                    Discriminator = table.Column<string>(nullable: false),
                    Height = table.Column<int>(nullable: false),
                    ID = table.Column<string>(nullable: false),
                    MaxVelocity = table.Column<double>(nullable: false),
                    Modified = table.Column<bool>(nullable: false),
                    MovementAngle = table.Column<double>(nullable: false),
                    MovementForce = table.Column<double>(nullable: false),
                    VelocityX = table.Column<double>(nullable: false),
                    VelocityY = table.Column<double>(nullable: false),
                    Width = table.Column<int>(nullable: false),
                    XCoord = table.Column<double>(nullable: false),
                    YCoord = table.Column<double>(nullable: false),
                    ZCoord = table.Column<string>(nullable: true),
                    AnchorX = table.Column<double>(nullable: false),
                    AnchorY = table.Column<double>(nullable: false),
                    AnchorZ = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    PortraitUri = table.Column<string>(nullable: true),
                    CoreEnergyPeak = table.Column<double>(nullable: true),
                    CoreEnergy = table.Column<double>(nullable: true),
                    CurrentEnergy = table.Column<double>(nullable: true),
                    CurrentCharge = table.Column<double>(nullable: true),
                    CurrentWillpower = table.Column<double>(nullable: true),
                    IsCharging = table.Column<bool>(nullable: true),
                    IsRespawnable = table.Column<bool>(nullable: true),
                    AfterUserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameObjects", x => x.ID);
                    table.ForeignKey(
                        name: "FK_GameObjects_AspNetUsers_AfterUserId",
                        column: x => x.AfterUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "StatusEffects",
                columns: table => new
                {
                    ID = table.Column<string>(nullable: false),
                    Timing = table.Column<int>(nullable: false),
                    Type = table.Column<int>(nullable: false),
                    Amount = table.Column<double>(nullable: false),
                    Expiration = table.Column<DateTime>(nullable: false),
                    Interval = table.Column<TimeSpan>(nullable: false),
                    LastTick = table.Column<DateTime>(nullable: false),
                    CharacterID = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StatusEffects", x => x.ID);
                    table.ForeignKey(
                        name: "FK_StatusEffects_GameObjects_CharacterID",
                        column: x => x.CharacterID,
                        principalTable: "GameObjects",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_UserName",
                table: "AspNetUsers",
                column: "UserName");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_GameObjects_Name",
                table: "GameObjects",
                column: "Name",
                unique: true,
                filter: "[Name] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_GameObjects_ID",
                table: "GameObjects",
                column: "ID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GameObjects_XCoord_YCoord_ZCoord",
                table: "GameObjects",
                columns: new[] { "XCoord", "YCoord", "ZCoord" });

            migrationBuilder.CreateIndex(
                name: "IX_GameObjects_AfterUserId",
                table: "GameObjects",
                column: "AfterUserId");

            migrationBuilder.CreateIndex(
                name: "IX_StatusEffects_CharacterID",
                table: "StatusEffects",
                column: "CharacterID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "Errors");

            migrationBuilder.DropTable(
                name: "StatusEffects");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "GameObjects");

            migrationBuilder.DropTable(
                name: "AspNetUsers");
        }
    }
}
