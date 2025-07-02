using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Trackify.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEmployeeAddNoAndDoc : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EmpDoc",
                table: "Employees",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmpNo",
                table: "Employees",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmpDoc",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "EmpNo",
                table: "Employees");
        }
    }
}
