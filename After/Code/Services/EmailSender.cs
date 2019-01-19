using Microsoft.AspNetCore.Identity.UI.Services;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace After.Code.Services
{
    // This class is used by the application to send email for account confirmation and password reset.
    // For more details see https://go.microsoft.com/fwlink/?LinkID=532713
    public class EmailSender
    {
        public Task SendEmailAsync(string email, string replyTo, string subject, string message)
        {
            try
            {
                var client = new SmtpClient("mail.lucency.co");
                client.SendAsync(replyTo, email, subject, message, null);
            }
            catch { }

            return Task.CompletedTask;
        }
        public void SendEmail(string email, string replyTo, string subject, string message)
        {
            try
            {
                var client = new SmtpClient("mail.lucency.co");
                client.SendAsync(replyTo, email, subject, message, null);
            }
            catch{ }

        }
    }
}
