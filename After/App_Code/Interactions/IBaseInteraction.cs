using After.Models;

namespace After.Interactions
{
    public interface IBaseInteraction
    {
        void ExecuteInteraction(Character Executor, Character Initiator);
    }
}
