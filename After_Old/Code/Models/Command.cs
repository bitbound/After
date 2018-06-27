using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Data
{
    public class Command
    {
        public string Name { get; set; }
        public string Category { get; set; }
        public string HelpText { get; set; }
        public delegate void Execute();
    }
}
