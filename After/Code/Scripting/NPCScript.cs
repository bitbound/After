using After.Models;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Scripting
{
    public class NPCScript : IScript
    {
        public Triggers Trigger { get; set; }
        public string ScriptText { get; set; }
        public dynamic Executor { get; set; }
        public dynamic Initiator { get; set; }

        public void InitiateDialog(string DialogID)
        {

        }

        public void Attack()
        {

        }

        public void Run()
        {

        }


        public async Task FireScript(dynamic Executor, dynamic Initiator, Triggers Trigger)
        {
            this.Executor = Storage.Current.NPCs.Find(Executor);
            this.Initiator = Initiator;
            await CSharpScript.EvaluateAsync(ScriptText, ScriptOptions.Default, this, typeof(NPCScript));
        }
    }
}
