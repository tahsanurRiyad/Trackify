namespace Trackify.Api.Models
{
    public class Asset
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Laptop, Desktop, Printer
        public string Status { get; set; } = "In Stock"; // In Use, Broken, In Stock, In Repair
        public int? AssignedToEmployeeId { get; set; }
        public DateTime PurchasedDate { get; set; }

        public Employee? AssignedEmployee { get; set; }
    }
}
