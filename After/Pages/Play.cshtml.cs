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
    [Authorize]
    public class PlayModel : PageModel
    {
        public bool CharacterNotFound { get; set; }
        private DataService DataService { get; set; }
        public PlayModel(DataService dataService)
        {
            DataService = dataService;
        }
        public void OnGet(string character)
        {
            var playerCharacter = DataService.GetCharacter(User.Identity.Name, character);
            if (playerCharacter == null)
            {
                CharacterNotFound = true;
            }
        }
    }
}