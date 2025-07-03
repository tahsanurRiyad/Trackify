namespace Trackify.Api.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string EmpNo { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public DateTime JoiningDate { get; set; }
        public bool IsActive { get; set; }
        public DateTime? TerminationDate { get; set; }
        public string? EmpDoc { get; set; }
        public string? ProfilePicture { get; set; }
    }
}
