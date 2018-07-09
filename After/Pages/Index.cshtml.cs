using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using After.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace After.Pages
{
    public class IndexModel : PageModel
    {
        private DataService DataService { get; set; }
        public IndexModel(DataService dataService)
        {
            DataService = dataService;
        }
        public void OnGet()
        {
        }

        [Authorize]
        public void OnPost(string characterName)
        {
            DataService.DeleteCharacter(characterName);
        }
    }
}
