using System.Collections.Generic;

namespace After.Data
{
    public class Power
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public double MinRange { get; set; }
        public double MaxRange { get; set; }
        public bool CanCrossZCoord { get; set; }
        public List<Targets> TargetList { get; set; } = new List<Targets>();
        public enum Targets
        {
            Self,
            Character,
            Player,
            Location
        }
    }
}