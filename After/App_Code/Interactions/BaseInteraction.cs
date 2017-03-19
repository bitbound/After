using System.Xml.Serialization;

namespace After.Interactions
{
    public class BaseInteraction
    {
        public string Namespace
        {
            get
            {
                return this.GetType().Namespace;
            }
        }
        public string InteractionID { get; set; }
        public Triggers Trigger { get; set; }

        public enum Triggers
        {
            OnEnter,
            OnTalk,
            OnView,
        }
    }
}
