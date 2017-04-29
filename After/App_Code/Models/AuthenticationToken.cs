using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace After.Models
{
    public class AuthenticationToken
    {
        public string Token { get; set; }
        public DateTime LastUsed { get; set; }
    }
}