using System.Threading.Tasks;

namespace After.Code.Scripting
{
    public interface IScript
    {
        string ScriptText { get; set; }
        Triggers Trigger { get; set; }
        Task FireScript(dynamic Executor, dynamic Initiator, Triggers Trigger);

    }
}