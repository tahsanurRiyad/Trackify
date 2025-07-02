using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Trackify.Api.Data;
using Trackify.Api.DTOs;
using Trackify.Api.Models;

namespace Trackify.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExpensesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.Expenses.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create(Expense expense)
        {
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = expense.Id }, expense);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, [FromForm] ExpenseDto dto)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null) return NotFound();

            expense.Category = dto.Category;
            expense.Amount = dto.Amount;
            expense.Description = dto.Description;
            expense.Date = dto.Date;
            expense.ReceiptUrl = dto.ReceiptFile == null || dto.ReceiptFile == "" ? dto.ReceiptUrl : null;

            await _context.SaveChangesAsync();
            return Ok(expense);
        }


        [HttpPost("upload")]
        public async Task<IActionResult> UploadExpense([FromForm] ExpenseUploadDto dto)
        {
            try
            {
                string? filePath = null;

                if (dto.Receipt != null)
                {
                    var uploadsFolder = Path.Combine("wwwroot", "receipts");

                    // Check if the uploads folder exists, if not, create it
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var fileName = Guid.NewGuid() + Path.GetExtension(dto.Receipt.FileName);
                    filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await dto.Receipt.CopyToAsync(stream);
                    }

                    filePath = $"/receipts/{fileName}";
                }

                var expense = new Expense
                {
                    Category = dto.Category,
                    Amount = dto.Amount,
                    Description = dto.Description,
                    Date = dto.Date,
                    ReceiptUrl = filePath
                };

                _context.Expenses.Add(expense);
                await _context.SaveChangesAsync();

                return Ok(expense);
            }
            catch (Exception ex)
            {
                // Log the exception for debugging purposes
                Console.WriteLine($"Error uploading expense: {ex.Message}");
                // Re-throw the exception or return a more specific error response
                return StatusCode(500, "An error occurred while uploading the expense.");
            }
        }

    }

    public class ExpenseDto
    {
        public int Id { get; set; }
        public string Category { get; set; } = string.Empty; // Food, Supplies, Electronics
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string? ReceiptFile { get; set; }
        public string? ReceiptUrl { get; set; }
    }
}
