using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace After.Pages
{
    public class CharacterCreateModel : PageModel
    {
        public void OnGet()
        {
            
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