using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Scripting
{
    public enum Triggers
    {
        /// <summary>
        /// Occurs when this item becomes aware of a character (player or NPC).
        /// </summary>
        OnBecomeAwareCharacter,
        /// <summary>
        /// Occurs when this item becomes aware of a player (not NPC).
        /// </summary>
        OnBecomeAwarePlayer,
        /// <summary>
        /// Occurs when this item becomes aware of an NPC (not player).
        /// </summary>
        OnBecomeAwareNPC,
        /// <summary>
        /// Occurs when a player (not NPC) enters the room where this trigger is located.
        /// </summary>
        OnDefaultAction
    }
}
