using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using After.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace After.Pages
{
    public class IndexModel : PageModel
    {
        public AfterUser AfterUser { get; set; }
        public void OnGet(AfterUser afterUser)
        {
            AfterUser = afterUser;
        }
    }
}
