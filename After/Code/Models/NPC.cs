using System.Collections.Generic;

namespace After.Models
{
    public class NPC : Character
    {
        public List<Script> Scripts { get; set; } = new List<Script>();
    }
}
