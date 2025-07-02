using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Trackify.Api.Data;
using Trackify.Api.Models;
using Trackify.Api.Services;

namespace Trackify.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TrackifyUsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PasswordService _passwordService;

        public TrackifyUsersController(AppDbContext context, PasswordService passwordService)
        {
            _context = context;
            _passwordService = passwordService;
        }

        // Create User
        [HttpPost("create")]
        public async Task<IActionResult> CreateUser([FromBody] TrackifyUsers user)
        {
            if (await _context.TrackifyUsers.AnyAsync(u => u.UserName == user.UserName))
                return BadRequest("Username already exists.");

            user.Password = _passwordService.HashPassword(user.Password);
            user.CreatedAt = DateTime.UtcNow;
            _context.TrackifyUsers.Add(user);
            await _context.SaveChangesAsync();

            return Ok(user);
        }

        // Update User
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] TrackifyUsers updatedUser)
        {
            var user = await _context.TrackifyUsers.FindAsync(id);
            if (user == null)
                return NotFound("User not found.");

            user.Password = _passwordService.HashPassword(updatedUser.Password);
            user.UserName = updatedUser.UserName;
            user.Email = updatedUser.Email;

            // Only update password if provided (optional)
            if (!string.IsNullOrWhiteSpace(updatedUser.Password))
                user.Password = updatedUser.Password;

            await _context.SaveChangesAsync();
            return Ok(user);
        }

        // Delete User
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.TrackifyUsers.FindAsync(id);
            if (user == null)
                return NotFound("User not found.");

            _context.TrackifyUsers.Remove(user);
            await _context.SaveChangesAsync();

            return Ok("User deleted successfully.");
        }

        // User Login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] TrackifyUsers loginRequest)
        {
            var user = await _context.TrackifyUsers
                .FirstOrDefaultAsync(u => u.UserName == loginRequest.UserName);

            if (user == null || !_passwordService.VerifyPassword(user.Password, loginRequest.Password))
                return Unauthorized("Invalid username or password.");

            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Login successful",
                user.Id,
                user.UserName,
                user.Email,
                user.LastLoginAt
            });
        }

    }
}
