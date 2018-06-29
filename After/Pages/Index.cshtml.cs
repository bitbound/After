using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using After.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace After.Pages
{
    public class IndexModel : PageModel
    {
        public AfterUser AfterUser { get; set; }
        private UserManager<AfterUser> UserManager { get; set; }
        public IndexModel(UserManager<AfterUser> userManager)
        {
            UserManager = userManager;
        }
        public async Task OnGet()
        {
            AfterUser = await UserManager.GetUserAsync(User);
        }
    }
}
