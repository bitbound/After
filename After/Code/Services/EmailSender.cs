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
            var mailClient = new SmtpClient();
            mailClient.Host = "mail.after-game.net";
            mailClient.Port = 25;
            mailClient.EnableSsl = false;
            mailClient.Credentials = new NetworkCredential("hello@after-game.net", "xH78eKysI%7D");
            mailClient.DeliveryMethod = SmtpDeliveryMethod.Network;

            var from = new MailAddress("hello@after-game.net", "After Support");
            var to = new MailAddress(email);

            var mailMessage = new MailMessage(from, to);
            mailMessage.IsBodyHtml = true;
            mailMessage.Subject = subject;
            mailMessage.Body = message;
            mailMessage.ReplyTo = new MailAddress(replyTo);

            mailMessage.Bcc.Add("hello@after-game.net");

            try
            {
                mailClient.Send(mailMessage);
            }
            catch { }

            return Task.CompletedTask;
        }
    }
}
