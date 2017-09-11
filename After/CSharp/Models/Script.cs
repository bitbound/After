namespace After.Models
{
    public class Script
    {
        public string ScriptText { get; set; }
        public Triggers Trigger { get; set; }
        public enum Triggers
        {
            OnEnter,
            OnTalk,
            OnView,
        }
    }
}