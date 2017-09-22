using After.Models;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Scripting
{
    public class NPCScript : IScript
    {
        public string ScriptText { get; set; }
        public Triggers Trigger { get; set; }
        public NPC Executor { get; set; }
        public string InitiatorID { get; set; }
        public string InitiatorName { get; set; }
        public List<Type> TriggerSources { get; set; }

        public void InitiateDialog(string DialogID)
        {
            
        }

        // TODO: Attack, run, do stuff, etc.

        public async Task FireScript<T>(T Executor, string InitiatorID, string InitiatorName)
        {
            this.Executor = Executor as NPC;
            this.InitiatorID = InitiatorID;
            this.InitiatorName = InitiatorName;
            await CSharpScript.EvaluateAsync(ScriptText, ScriptOptions.Default, this, typeof(NPCScript));
        }
    }
}
