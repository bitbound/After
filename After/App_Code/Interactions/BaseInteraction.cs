using System.Xml.Serialization;

namespace After.Interactions
{
    [XmlInclude(typeof(Ferryman0))]
    public class BaseInteraction
    {
        public string Namespace
        {
            get
            {
                return this.GetType().Namespace;
            }
            set
            {

            }
        }

        public Triggers Trigger { get; set; }

        public enum Triggers
        {
            OnEnter,
            OnTalk,
            OnView,
        }
    }
}
