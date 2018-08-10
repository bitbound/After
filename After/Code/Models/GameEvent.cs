using System.Collections.Generic;
using System.Drawing;

namespace After.Code.Services
{
    public class GameEvent
    {
        public string EventName { get; set; }
        public double XCoord { get; set; }
        public double YCoord { get; set; }
        public string ZCoord { get; set; }
        public Dictionary<string, dynamic> EventData { get; set; }
    }
}