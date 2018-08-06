using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using After.Areas.Identity.Pages.Account;
using After.Code.Models;
using After.Code.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace After.Pages.API
{
    public class QuickPlayModel : PageModel
    {
        private SignInManager<AfterUser> SignInManager { get; set; }
        private UserManager<AfterUser> UserManager { get; set; }
        private ILogger<QuickPlayModel> Logger { get; set; }
        private DataService DataService { get; }
        private IEmailSender EmailSender { get; set; }

        public QuickPlayModel(
            UserManager<AfterUser> userManager,
            SignInManager<AfterUser> signInManager,
            ILogger<QuickPlayModel> logger,
            DataService dataService)
        {
            UserManager = userManager;
            SignInManager = signInManager;
            Logger = logger;
            DataService = dataService;
        }


        public async Task<IActionResult> OnGet()
        {
            var userName = Guid.NewGuid().ToString();
            var password = Guid.NewGuid().ToString();
            password = password.Substring(0, 5).ToUpper() + password.Substring(5);
            var characterName = "Soul" + new Random().Next(0, 9999999).ToString();
            while (DataService.IsCharacterNameTaken(characterName))
            {
                characterName = "Soul" + new Random().Next(0, 9999999).ToString();
            }
            if (ModelState.IsValid)
            {
                var user = new AfterUser {
                    UserName = userName,
                    IsTemporary = true,
                    Characters = new List<PlayerCharacter>()
                    {
                        new PlayerCharacter()
                        {
                            Name = characterName
                        }
                    }
                };
                var result = await UserManager.CreateAsync(user, password);
                if (result.Succeeded)
                {
                    Logger.LogInformation("Temporary user created.");

                    await SignInManager.SignInAsync(user, isPersistent: false);

                    return LocalRedirect($"/play?character={characterName}");
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            // If we got this far, something failed, redisplay form
            return LocalRedirect("/");
        }
    }
}