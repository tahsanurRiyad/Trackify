using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Trackify.Api.Data;
using Trackify.Api.Models;

namespace Trackify.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AssetsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AssetsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var assets = await _context.Assets.Include(a => a.AssignedEmployee).ToListAsync();
                return Ok(assets);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var asset = await _context.Assets.Include(a => a.AssignedEmployee).FirstOrDefaultAsync(a => a.Id == id);
                if (asset == null)
                    return NotFound();

                return Ok(asset);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create(Asset asset)
        {
            try
            {
                _context.Assets.Add(asset);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetAll), new { id = asset.Id }, asset);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Asset asset)
        {
            if (id != asset.Id)
            {
                return BadRequest("Asset ID mismatch between route and body.");
            }

            try
            {
                _context.Entry(asset).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Assets.Any(e => e.Id == id))
                {
                    return NotFound($"Asset with ID {id} not found.");
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating asset: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var asset = await _context.Assets.FindAsync(id);
                if (asset == null)
                    return NotFound();

                _context.Assets.Remove(asset);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
