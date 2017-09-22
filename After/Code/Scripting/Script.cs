using System.Threading.Tasks;

namespace After.Code.Scripting
{
    public class Script
    {
        public virtual string ScriptText { get; set; }
        public virtual Triggers Trigger { get; set; }
        public virtual async Task FireScript<T>(T Executor, string Initiator)
        {
            await Task.Delay(0);
        }

    }
}