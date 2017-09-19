using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace After.Pages.Services
{
    public class ErrorReportingModel : PageModel
    {
        public void OnGet()
        {
            using (var sw = new System.IO.StreamWriter(Response.Body))
            {
                sw.Write("OK");
            }
        }
        public void OnPost()
        {
            var strError = new System.IO.StreamReader(Request.Body).ReadToEnd();
            var di = System.IO.Directory.CreateDirectory(System.IO.Path.Combine(After.Utilities.DataPath, "ClientErrors"));
            System.IO.File.AppendAllText(di.FullName + "\\" + DateTime.Now.ToString("yyyy-MM-dd") + ".txt", strError + Environment.NewLine + Environment.NewLine);
            Response.StatusCode = 200;
            using (var sw = new System.IO.StreamWriter(Response.Body))
            {
                sw.Write(strError);
            }
        }
    }
}