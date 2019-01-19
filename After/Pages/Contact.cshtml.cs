using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using After.Code.Services;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace After.Pages
{
    public class ContactModel : PageModel
    {
        public InputModel Input { get; set; }
        private EmailSender EmailSender { get; set; }
        public ContactModel(EmailSender emailSender)
        {
            EmailSender = emailSender;
        }
        public void OnGet()
        {
        }
        public void OnPost(InputModel input)
        {
            if (string.IsNullOrWhiteSpace(input.Phone))
            {
                var client = new SmtpClient("mail.lucency.co");
                client.SendAsync(input.Email, "jared@lucency.co", "Message from After", $"From {input.Name}\r\n\r\n" + input.Message, null);
            }
            else
            {
                System.Threading.Thread.Sleep(60000);
            }
            Response.Redirect("/Contact?success=true");
        }
        public class InputModel
        {
  
            [Required]
            [EmailAddress]
            [Display(Name = "Your Email")]
            public string Email { get; set; }


            [Required]
            [Display(Name = "Your Name")]
            public string Name { get; set; }

            [Required]
            [Display(Name = "Message")]
            [StringLength(2000)]
            public string Message { get; set; }

            public string Phone { get; set; }
        }
    }
}
