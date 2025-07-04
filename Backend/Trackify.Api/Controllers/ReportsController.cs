using FastReport.Export.PdfSimple;
using FastReport;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;
using Microsoft.EntityFrameworkCore;
using Trackify.Api.Data;
using Trackify.Api.Models;
using FastReport.Web;
using FastReport.Data;
using FastReport.Utils;
using System.Data;
using Trackify.Api.Services;

namespace Trackify.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("pdf/employees")]
        public IActionResult ExportEmployeesPdf()
        {
            var employees = GetData();
            var employeeTable = Utilities.ToDataTable(employees);
            employeeTable.TableName = "EmployeeList";

            var dataSet = new DataSet("EmployeeData");
            dataSet.Tables.Add(employeeTable);

            var report = new Report();
            report.Load(Path.Combine("Reports", "EmployeesReport.frx"));

            // Register the dataset
            report.RegisterData(dataSet, "EmployeeData");
            report.GetDataSource("EmployeeList").Enabled = true;

            report.Prepare();

            using var ms = new MemoryStream();
            var pdfExport = new FastReport.Export.PdfSimple.PDFSimpleExport();
            report.Export(pdfExport, ms);
            ms.Position = 0;

            return File(ms.ToArray(), "application/pdf", "EmployeeReport.pdf");
        }

        [HttpGet("GetData")]
        public IList<Employee> GetData()
        {
            // Gets the data from EF Core DbContext
            return _context.Employees.ToList();
        }


        [HttpGet("web/employees")]
        public IActionResult WebEmployees()
        {
            RegisteredObjects.AddConnection(typeof(MsSqlDataConnection));

            var webReport = new FastReport.Web.WebReport
            {
                Width = "100%",
                Height = "800px"
            };
            webReport.Report.Load(Path.Combine("Reports", "EmployeesReport.frx"));
            webReport.Mode = FastReport.Web.WebReportMode.Preview;

            var htmlContent = webReport.Render().Result.Value;
            return Content(htmlContent, "text/html");
        }

        [HttpGet("GetXML")]
        public IActionResult GetXML(string name = "EmployeeData")
        {
            var employees = _context.Employees.Take(3).ToList();
            var table = Utilities.ToDataTable(employees);
            table.TableName = "EmployeeList";

            var ds = new DataSet(name);
            ds.Tables.Add(table);

            // Save to memory stream instead of disk
            using var ms = new MemoryStream();
            ds.WriteXml(ms, XmlWriteMode.WriteSchema);
            ms.Position = 0;

            var fileName = $"{name}.xml";
            return File(ms.ToArray(), "application/xml", fileName);
        }
    }
}
