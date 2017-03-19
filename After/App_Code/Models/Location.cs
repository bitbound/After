using After.Interactions;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;


namespace After.Models
{
    public class Location
    {
        public double XCoord { get; set; }
        public double YCoord { get; set; }
        public string ZCoord { get; set; }
        public string LocationID
        {
            get
            {
                return XCoord.ToString() + "," + YCoord.ToString() + "," + ZCoord.ToString();
            }
            set
            {
                var split = value.Split(',');
                XCoord = double.Parse(split[0]);
                YCoord = double.Parse(split[1]);
                ZCoord = split[2];
            }
        }
        public string Color { get; set; } = "darkgray";

        public string Title { get; set; }
        public string Description { get; set; }
        public bool Static { get; set; }
        public DateTime? LastVisited { get; set; }
        public Player LastVisitedBy { get; set; }
        public int Willpower { get; set; }
        
        public virtual ICollection<Character> Occupants { get; set; }
        public bool IsInnerVoid { get; set; }
        public int OwnerID { get; set; }
        public virtual ICollection<BaseInteraction> Interactions { get; set; }

        public static bool Exists(string XYZ)
        {
            if (World.Current.Locations.FirstOrDefault(loc => loc.LocationID == XYZ) != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        public void AddOccupant(Character AddedOccupant)
        {
            if (Occupants.ToList().Exists(chara => chara.CharacterID == AddedOccupant.CharacterID))
            {
                RemoveOccupant(AddedOccupant);
            }
            Occupants.Add(AddedOccupant);
        }
        public void RemoveOccupant(Character CharacterObject)
        {
            Occupants.Remove(Occupants.FirstOrDefault(cha => cha.CharacterID == CharacterObject.CharacterID));
        }
        public bool ContainsOccupant(Character CharacterObject)
        {
            return Occupants.ToList().Exists(cha => cha.CharacterID == CharacterObject.CharacterID);
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
