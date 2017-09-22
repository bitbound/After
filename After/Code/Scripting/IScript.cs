using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace After.Scripting
{
    public interface IScript
    {
        string ScriptText { get; set; }
        Triggers Trigger { get; set; }
        string InitiatorID { get; set; }
        string InitiatorName { get; set; }
        
        List<Type> TriggerSources { get; set; }
        Task FireScript<T>(T Executor, string InitiatorID, string InitiatorName);

    }
}