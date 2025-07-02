namespace Trackify.Api.Models
{
    public class Expense
    {
        public int Id { get; set; }
        public string Category { get; set; } = string.Empty; // Food, Supplies, Electronics
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string? ReceiptUrl { get; set; }
    }
}
