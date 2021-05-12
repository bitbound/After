using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using After.Code.Models;
using After.Code.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace After.Pages
{
    public class IndexModel : PageModel
    {
        private DataService DataService { get; set; }
        private UserManager<AfterUser> UserManager { get; set; }
        private SignInManager<AfterUser> SignInManager { get; set; }

        public IndexModel(DataService dataService, UserManager<AfterUser> userManager, SignInManager<AfterUser> signInManager)
        {
            DataService = dataService;
            UserManager = userManager;
            SignInManager = signInManager;
        }
        public async Task<IActionResult> OnGet()
        {
            if (User.Identity.IsAuthenticated)
            {
                if (await UserManager.GetUserAsync(User) is null)
                {
                    await SignInManager.SignOutAsync();
                    return LocalRedirect("/");
                }
            }
            return Page();
        }

        public IActionResult OnPost(string characterName)
        {
            DataService.DeleteCharacter(characterName);
            return LocalRedirect("/");
        }
    }
}
