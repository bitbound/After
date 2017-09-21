using After.Code.Scripting;
using System;
using System.Collections.Generic;

namespace After.Models
{
    public class NPC : Character
    {
        public List<IScript> Scripts { get; set; } = new List<IScript>();

    }
}
