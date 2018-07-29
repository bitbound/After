using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata;
using System.ComponentModel.DataAnnotations;

namespace After.Code.Models
{
    public class AfterUser : IdentityUser
    {
        public List<PlayerCharacter> Characters { get; set; } = new List<PlayerCharacter>();
        public bool IsTemporary { get; set; } = false;
        public DateTime LastLogin { get; set; } = DateTime.Now;
    }
}
