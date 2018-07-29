using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using After.Code.Models;
using After.Code.Services;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace After.Pages
{
    public class ErrorModel : PageModel
    {
        public string RequestId { get; set; }

        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);

        private IEmailSender EmailSender { get; set; }
        private DataService DataService { get; set; }
        public ErrorModel(IEmailSender emailSender, DataService dataSerivce)
        {
            EmailSender = emailSender;
            DataService = dataSerivce;
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task OnGet()
        {
            RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier;

            // Get the details of the exception that occurred
            var exceptionFeature = HttpContext.Features.Get<IExceptionHandlerPathFeature>();

            if (exceptionFeature != null)
            {
                // Get which route the exception occurred at
                string routeWhereExceptionOccurred = exceptionFeature.Path;

                // Get the exception that occurred
                Exception exceptionThatOccurred = exceptionFeature.Error;

                var error = new Error()
                {
                    PathWhereOccurred = routeWhereExceptionOccurred,
                    User = User.Identity.Name,
                    Message = exceptionThatOccurred.Message,
                    StackTrace = exceptionThatOccurred.StackTrace,
                    Source = exceptionThatOccurred.Source,
                    Timestamp = DateTime.Now
                };

                try
                {
                    DataService.AddError(error);
                    await EmailSender.SendEmailAsync("jared@lucent.rocks", "After Server Error", JsonConvert.SerializeObject(error));
                }
                catch{ }
            }

        }
    }
}
