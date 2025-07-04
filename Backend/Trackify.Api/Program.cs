using Microsoft.EntityFrameworkCore;
using Trackify.Api.Data;
using Trackify.Api.Services;
using FastReport;
using FastReport.Web;
using FastReport.Export.PdfSimple;
using FastReport.Data;
using FastReport.Utils;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddControllersWithViews();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure DbContext with SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", b =>
    {
        b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services.AddSingleton<PasswordService>();
builder.Services.AddFastReport();

RegisteredObjects.AddConnection(typeof(MsSqlDataConnection));

var app = builder.Build();

app.UseCors("AllowAll");

app.UseFastReport();
app.MapGet("/", () => "FastReport ready!");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles();
app.MapControllers();
app.Run();


var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "receipts");
if (!Directory.Exists(uploadsDir))
    Directory.CreateDirectory(uploadsDir);
