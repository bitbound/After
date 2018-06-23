using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Scripting
{
    public enum Triggers
    {
        /// <summary>
        /// Occurs when this item becomes aware of the initiator.
        /// </summary>
        OnBecomeAware,
        /// <summary>
        /// Occurs when a player (not NPC) enters the room where this trigger is located.
        /// </summary>
        OnDefaultAction
    }
}
