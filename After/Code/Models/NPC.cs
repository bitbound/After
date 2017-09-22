using After.Models;
using After.Scripting;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace After.Models
{
    public class NPC : Character
    {
        public List<NPCScript> Scripts { get; set; } = new List<NPCScript>();
        public List<DialogItem> DialogItems { get; set; } = new List<DialogItem>();
        public async Task CheckAwareness(Character ApproachingCharacter)
        {
            var script = Scripts?.Find(scr => scr.Trigger == Triggers.OnBecomeAware && scr.TriggerSources.Contains(ApproachingCharacter.GetType()));
            if (script != null)
            {
                // TODO: Check for stealth.
                await script.FireScript(this, ApproachingCharacter.StorageID, ApproachingCharacter.DisplayName);
            }
        }
    }
}
