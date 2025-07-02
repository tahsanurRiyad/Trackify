using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Trackify.Api.Migrations
{
    /// <inheritdoc />
    public partial class TrackifyUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TrackifyUsers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastLoginAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackifyUsers", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Assets_AssignedToEmployeeId",
                table: "Assets",
                column: "AssignedToEmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Assets_Employees_AssignedToEmployeeId",
                table: "Assets",
                column: "AssignedToEmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assets_Employees_AssignedToEmployeeId",
                table: "Assets");

            migrationBuilder.DropTable(
                name: "TrackifyUsers");

            migrationBuilder.DropIndex(
                name: "IX_Assets_AssignedToEmployeeId",
                table: "Assets");
        }
    }
}
