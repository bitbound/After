using After.Data;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata;
using System.ComponentModel.DataAnnotations;

namespace After.Data
{
    public class AfterUser : IdentityUser
    {
        [Required]
        [StringLength(20, MinimumLength = 4)]
        [RegularExpression(@"^[a-zA-Z0-9_\-]*$", ErrorMessage = "Username can only contain letters, numbers, hyphens, and underscores.")]
        [Display(Name = "Username")]
        public override string UserName { get; set; }
        public List<PlayerCharacter> Characters { get; set; }
    }
}
