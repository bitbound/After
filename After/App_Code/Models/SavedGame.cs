using System;

namespace After.Models
{
    public class SavedGame
    {
        public override string ToString()
        {
            return Name;
        }
        public string Name { get; set; }
        public Guid GameID { get; set; } = Guid.NewGuid();
        public World World { get; set; }
    }
}
