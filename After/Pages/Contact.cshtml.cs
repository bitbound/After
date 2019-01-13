using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using After.Code.Services;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc.RazorPages;

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
        public async Task OnPost(InputModel input)
        {
            await EmailSender.SendEmailAsync($"", input.Email, "", $"From {input.Name}: <br/><br/>{input.Message}");
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
        }
    }
}
