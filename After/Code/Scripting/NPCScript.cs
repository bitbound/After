using After.Models;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Scripting
{
    public class NPCScript
    {
        public virtual string ScriptText { get; set; }
        public virtual Triggers Trigger { get; set; }
        public NPC Executor { get; set; }
        public string Initiator { get; set; }

        public void InitiateDialog(string DialogID)
        {
            // TODO: Temp.
            Utilities.BroadcastMessage(DialogID, "Norahc", "Global");
        }

        // TODO: Attack, run, do stuff, etc.

        public async Task FireScript(NPC Executor, string Initiator)
        {
            this.Executor = Executor as NPC;
            this.Initiator = Initiator;
            await CSharpScript.EvaluateAsync(ScriptText, ScriptOptions.Default, this, typeof(NPCScript));
        }
        
    }
}
