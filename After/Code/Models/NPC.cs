using After.Code.Models;
using After.Code.Scripting;
using System;
using System.Collections.Generic;

namespace After.Models
{
    public class NPC : Character
    {
        public List<NPCScript> Scripts { get; set; } = new List<NPCScript>();
        public List<DialogItem> DialogItems { get; set; } = new List<DialogItem>();
    }
}
