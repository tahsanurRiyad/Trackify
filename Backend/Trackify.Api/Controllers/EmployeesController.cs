using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Trackify.Api.Data;
using Trackify.Api.Models;

namespace Trackify.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/employees
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var employees = await _context.Employees.ToListAsync();
                return Ok(employees);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/employees/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var employee = await _context.Employees.FindAsync(id);
                if (employee == null)
                    return NotFound();

                return Ok(employee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        //[HttpPost]
        //[Consumes("multipart/form-data")]
        //public async Task<IActionResult> Create([FromForm] Employee employee, IFormFile? document)
        //{
        //    try
        //    {
        //        if (document != null)
        //        {
        //            var filePath = await SaveDocument(document);
        //            employee.EmpDoc = filePath;
        //        }

        //        _context.Employees.Add(employee);
        //        await _context.SaveChangesAsync();
        //        return CreatedAtAction(nameof(GetAll), new { id = employee.Id }, employee);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Internal server error: {ex.Message}");
        //    }
        //}

        //[HttpPut("{id}")]
        //[Consumes("multipart/form-data")]
        //public async Task<IActionResult> Update(int id, [FromForm] Employee employee, IFormFile? document)
        //{
        //    try
        //    {
        //        var existingEmployee = await _context.Employees.FindAsync(id);
        //        if (existingEmployee == null) return NotFound();

        //        // Update fields
        //        existingEmployee.Name = employee.Name;
        //        existingEmployee.Address = employee.Address;
        //        existingEmployee.Email = employee.Email;
        //        existingEmployee.Phone = employee.Phone;
        //        existingEmployee.Designation = employee.Designation;
        //        existingEmployee.JoiningDate = employee.JoiningDate;
        //        existingEmployee.TerminationDate = employee.TerminationDate;
        //        existingEmployee.IsActive = employee.IsActive;

        //        if (document != null)
        //        {
        //            var filePath = await SaveDocument(document);
        //            existingEmployee.EmpDoc = filePath;
        //        }

        //        await _context.SaveChangesAsync();
        //        return Ok(existingEmployee);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Internal server error: {ex.Message}");
        //    }
        //}


        // DELETE: api/employees/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var employee = await _context.Employees.FindAsync(id);
                if (employee == null)
                    return NotFound();

                _context.Employees.Remove(employee);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        //private async Task<string> SaveDocument(IFormFile file)
        //{
        //    try
        //    {
        //        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "empDoc");
        //        if (!Directory.Exists(uploadsFolder))
        //            Directory.CreateDirectory(uploadsFolder);

        //        var fileName = $"{Guid.NewGuid()}_{file.FileName}";
        //        var fullPath = Path.Combine(uploadsFolder, fileName);

        //        using (var stream = new FileStream(fullPath, FileMode.Create))
        //        {
        //            await file.CopyToAsync(stream);
        //        }

        //        // Return relative path
        //        return Path.Combine("empDoc", fileName).Replace("\\", "/");
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception(ex.Message, ex);
        //    }
        //}



        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] Employee employee,
                                       IFormFile? profilePicture,
                                       IFormFile? document)
        {
            try
            {
                if (profilePicture != null)
                {
                    employee.ProfilePicture = await SaveFile(profilePicture, "profilePictures");
                }

                if (document != null)
                {
                    employee.EmpDoc = await SaveFile(document, "empDoc");
                }

                _context.Employees.Add(employee);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetAll), new { id = employee.Id }, employee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update(int id, [FromForm] Employee employee,
                                        IFormFile? profilePicture,
                                        IFormFile? document)
        {
            try
            {
                var existingEmployee = await _context.Employees.FindAsync(id);
                if (existingEmployee == null) return NotFound();

                // Update fields
                existingEmployee.EmpNo = employee.EmpNo;
                existingEmployee.Name = employee.Name;
                existingEmployee.Address = employee.Address;
                existingEmployee.Email = employee.Email;
                existingEmployee.Phone = employee.Phone;
                existingEmployee.Designation = employee.Designation;
                existingEmployee.JoiningDate = employee.JoiningDate;
                existingEmployee.TerminationDate = employee.TerminationDate;
                existingEmployee.IsActive = employee.IsActive;

                if (profilePicture != null)
                {
                    // Remove old profile picture if exists
                    if (!string.IsNullOrEmpty(existingEmployee.ProfilePicture))
                    {
                        DeleteFile(existingEmployee.ProfilePicture);
                    }
                    existingEmployee.ProfilePicture = await SaveFile(profilePicture, "profilePictures");
                }

                if (document != null)
                {
                    // Remove old document if exists
                    if (!string.IsNullOrEmpty(existingEmployee.EmpDoc))
                    {
                        DeleteFile(existingEmployee.EmpDoc);
                    }
                    existingEmployee.EmpDoc = await SaveFile(document, "empDoc");
                }

                await _context.SaveChangesAsync();
                return Ok(existingEmployee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private async Task<string> SaveFile(IFormFile file, string folderName)
        {
            try
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folderName);
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
                var fullPath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return Path.Combine(folderName, uniqueFileName).Replace("\\", "/");
            }
            catch (Exception ex)
            {
                throw new Exception("File save error: " + ex.Message, ex);
            }
        }

        private void DeleteFile(string filePath)
        {
            try
            {
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", filePath);
                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                }
            }
            catch (Exception ex)
            {
                // Log error but don't throw
                Console.WriteLine("Error deleting file: " + ex.Message);
            }
        }


    }
}
