namespace Trackify.Api.DTOs
{
    public class ExpenseUploadDto
    {
        public string Category { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public IFormFile? Receipt { get; set; }
    }
}
