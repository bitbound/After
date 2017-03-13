using After.Interactions;
using System;
using System.Collections.ObjectModel;
using System.Linq;


namespace After.Models
{
    public class Location
    {
        public double XCoord { get; set; }
        public double YCoord { get; set; }
        public string ZCoord { get; set; }
        public string XYZ
        {
            get
            {
                return XCoord.ToString() + "," + YCoord.ToString() + "," + ZCoord.ToString();
            }
        }
        public string Color { get; set; } = "darkgray";

        public string Title { get; set; }
        public string Description { get; set; }
        public bool Static { get; set; }
        public DateTime LastVisited { get; set; }
        public string LastVisitedBy { get; set; }
        public int Willpower { get; set; }
        
        public ObservableCollection<Character> Occupants { get; set; }

        public bool SaveOnClient { get; set; }
        public bool IsInnerVoid { get; set; }
        public Guid OwnerID { get; set; }
        public Guid SavedGameID { get; set; }

        public ObservableCollection<BaseInteraction> Interactions { get; set; }

        public void AddOccupant(Character AddedOccupant)
        {
            if (Occupants.ToList().Exists(chara => chara.ID == AddedOccupant.ID))
            {
                RemoveOccupant(AddedOccupant);
            }
            Occupants.Add(AddedOccupant);
        }
        public void RemoveOccupant(Character CharacterObject)
        {
            Occupants.Remove(Occupants.FirstOrDefault(cha => cha.ID == CharacterObject.ID));
        }
        public bool ContainsOccupant(Character CharacterObject)
        {
            return Occupants.ToList().Exists(cha => cha.ID == CharacterObject.ID);
        }
        public double GetDistanceFrom(Location FromLocation)
        {
            if (FromLocation.ZCoord != ZCoord)
            {
                return double.MaxValue;
            }
            return Math.Sqrt(
                Math.Pow(FromLocation.XCoord - XCoord, 2) +
                Math.Pow(FromLocation.YCoord - YCoord, 2)
            );
        }
    }
}
