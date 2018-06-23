using Microsoft.AspNetCore.Identity.UI.Services;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace After.Services
{
    // This class is used by the application to send email for account confirmation and password reset.
    // For more details see https://go.microsoft.com/fwlink/?LinkID=532713
    public class EmailSender : IEmailSender
    {
        public Task SendEmailAsync(string email, string subject, string message)
        {
            var mailClient = new SmtpClient();
            mailClient.Host = "mail.lucent.rocks";
            mailClient.Port = 25;
            mailClient.EnableSsl = false;
            mailClient.Credentials = new NetworkCredential("hello@lucent.rocks", "OkZ92B@RwQK^");
            mailClient.DeliveryMethod = SmtpDeliveryMethod.Network;

            var from = new MailAddress("hello@lucent.rocks", "After Support");
            var to = new MailAddress(email);

            var mailMessage = new MailMessage(from, to);
            mailMessage.IsBodyHtml = true;
            mailMessage.Subject = subject;
            mailMessage.Body = message;

            mailMessage.Bcc.Add("hello@lucent.rocks");

            mailClient.Send(mailMessage);
            return Task.CompletedTask;
        }
    }
}
