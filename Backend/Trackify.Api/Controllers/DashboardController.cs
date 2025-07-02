using Microsoft.AspNetCore.Mvc;
using Trackify.Api.Data;
using Trackify.Api.Services;

namespace Trackify.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public IActionResult GetSummary()
        {
            var dashboardData = new
            {
                employees = 222,
                assets = 88,
                expenses = 12450,
                pendingTasks = 7,
                recentActivities = new[]
                {
                new { title = "New employee onboarded", description = "John Doe joined the team", timeAgo = "10 minutes ago", icon = "bi-people" },
                new { title = "Asset updated", description = "Laptop assigned to Jane", timeAgo = "1 hour ago", icon = "bi-laptop" },
                new { title = "Expense submitted", description = "Office supplies purchased", timeAgo = "2 days ago", icon = "bi-receipt" }
            }
            };

            return Ok(dashboardData);
        }

        [HttpGet("monthly-expenses")]
        public IActionResult GetMonthlyExpenses()
        {
            var monthlyExpenses = new[]
                    {
                new { Month = "Jan", Amount = 1200 },
                new { Month = "Feb", Amount = 950 },
                new { Month = "Mar", Amount = 1300 },
                new { Month = "Apr", Amount = 1100 },
                new { Month = "May", Amount = 1250 },
                new { Month = "Jun", Amount = 1400 },
                new { Month = "Jul", Amount = 1600 },
                new { Month = "Aug", Amount = 1150 },
                new { Month = "Sep", Amount = 1700 },
                new { Month = "Oct", Amount = 1450 },
                new { Month = "Nov", Amount = 1000 },
                new { Month = "Dec", Amount = 1550 },
            };

            return Ok(monthlyExpenses);
        }


    }
}
