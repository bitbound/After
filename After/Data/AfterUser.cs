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
        public List<PlayerCharacter> Characters { get; set; }
    }
}
