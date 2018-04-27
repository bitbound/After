using After.Models;
using After.Scripting;
using After.Dependencies;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using After.Dependencies.WebSockets;
using After.Dependencies.StorageLists;

namespace After.Models
{
    public class Location : IStorageItem
    {
        public double XCoord { get; set; }
        public double YCoord { get; set; }
        public string ZCoord { get; set; }
        public string StorageID
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
        public bool IsStatic { get; set; }
        public bool IsPermanent { get; set; }
        public DateTime LastVisited { get; set; }
        public string LastVisitedBy { get; set; }
        public long InvestedWillpower { get; set; }
        public List<Occupant> Occupants { get; set; } = new List<Occupant>();
        public string OwnerID { get; set; }
        public List<IScript> Scripts { get; set; }
        public DateTime LastAccessed { get; set; }


        //*** Utility Methods ***//
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
        public List<WebSocketClient> GetNearbyPlayers()
        {
            return App.Server.ClientList.Where(client => (client?.Player as Player)?.GetCurrentLocation()?.GetDistanceFrom(this) <= client?.Player?.ViewDistance).ToList();
        }
        public async Task CharacterArrives(Character CharacterObject)
        {
            CharacterObject.CurrentXYZ = StorageID;
            Occupants.Add(new Occupant() { DisplayName = CharacterObject.DisplayName, StorageID = CharacterObject.StorageID });
            LastVisited = DateTime.Now;
            LastVisitedBy = CharacterObject.Name;
            var soul = CharacterObject.ConvertToSoul();
            var nearbyPlayers = GetNearbyPlayers();
            var request = JSON.Encode(new
            {
                Category = "Events",
                Type = "CharacterArrives",
                Soul = soul
            });
            foreach (var player in nearbyPlayers)
            {
                await player.SendString(request);
            }
            foreach (var occupant in Occupants)
            {
                Storage.Current.NPCs.Find(occupant.StorageID)?.CheckAwareness(CharacterObject);
            }
        }
        public async Task CharacterLeaves(Character CharacterObject)
        {
            var soul = CharacterObject.ConvertToSoul();
            var nearbyPlayers = GetNearbyPlayers();
            CharacterObject.CurrentXYZ = null;
            CharacterObject.PreviousXYZ = this.StorageID;
            Occupants.RemoveAll(occ=>occ.StorageID == CharacterObject.StorageID);
            var request = JSON.Encode(new
            {
                Category = "Events",
                Type = "CharacterLeaves",
                Soul = soul
            });
            foreach (var player in nearbyPlayers)
            {
                await player.SendString(request);
            }
        }
        public dynamic ConvertToArea(bool IsVisible)
        {
            if (IsVisible)
            {
                return new
                {
                    XCoord = this.XCoord,
                    YCoord = this.YCoord,
                    ZCoord = this.ZCoord,
                    StorageID = this.StorageID,
                    Color = this.Color,
                    Title = this.Title,
                    Occupants = this.Occupants,
                    Description = this.Description,
                    InvestedWillpower = this.InvestedWillpower,
                    LastVisited = this.LastVisited,
                    IsStatic = this.IsStatic,
                    IsVisible = true
                };
            }
            else
            {
                return new
                {
                    XCoord = this.XCoord,
                    YCoord = this.YCoord,
                    ZCoord = this.ZCoord,
                    StorageID = this.StorageID,
                    Color = this.Color,
                    Title = this.Title,
                    IsStatic = this.IsStatic,
                    LastVisited = this.LastVisited,
                    IsVisible = false
                };
            }
        }

        // *** Static Methods ***//
        public static Location CreateTempLocation(string[] XYZ)
        {
            var location = new Location();
            location.XCoord = double.Parse(XYZ[0]);
            location.YCoord = double.Parse(XYZ[1]);
            location.ZCoord = XYZ[2];
            location.Color = "black";
            location.Description = "A completely empty area.";
            location.Title = "Empty Area";
            location.LastAccessed = DateTime.Now;
            location.LastVisited = DateTime.Now;
            Storage.Current.Locations.Add(location);
            return location;
        }
    }
}
