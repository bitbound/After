using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using After.Code.Models;
using After.Code.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace After.Pages
{
    public class CharacterCreateModel : PageModel
    {
        private DataService DataService { get; set; }
        public CharacterCreateModel(DataService dataService)
        {
            DataService = dataService;
        }
        public void OnGet()
        {
            
        }

        public void OnPost(InputModel input)
        {
            if (ModelState.IsValid)
            {
                if (DataService.IsCharacterNameTaken(Input.CharacterName))
                {
                    ModelState.AddModelError("NameTaken", "Character name is already taken.");
                }
                else
                {
                    var newCharacter = new PlayerCharacter()
                    {
                        Name = input.CharacterName,
                        Color = input.Color
                    };
                    
                    DataService.AddNewCharacter(User.Identity.Name, newCharacter);
                    TempData.Add("Color", input.Color);
                    Response.Redirect("/Intro");
                }
            }
        }

        [BindProperty]
        public InputModel Input { get; set; }

        public class InputModel
        {
            [Required]
            [StringLength(20, MinimumLength = 4)]
            [RegularExpression(@"^[a-zA-Z0-9_\-]*$", ErrorMessage = "Username can only contain letters, numbers, hyphens, and underscores.")]
            [Display(Name = "Username")]
            public string CharacterName { get; set; }

            [Required]
            public string Color { get; set; }
        }
    }
}