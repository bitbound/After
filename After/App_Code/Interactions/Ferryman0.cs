using After.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace After.Interactions
{
    public class Ferryman0 : BaseInteraction
    {
        public Ferryman0()
        {
            this.Trigger = Triggers.OnView;
        }
        public int Step { get; set; } = 0;
    }
}
