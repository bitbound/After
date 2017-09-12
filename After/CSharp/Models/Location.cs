using Dynamic_JSON;
using System;
using System.Collections.Generic;
using System.Linq;
using Translucency.WebSockets;

namespace After.Models
{
    public class Location : StorageLists.IStorageItem
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
        public List<string> Occupants { get; set; } = new List<string>();
        public string OwnerID { get; set; }
        public List<Script> Scripts { get; set; }
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
            return Utilities.Server.ClientList.Where(client => (client.Tags?["Player"] as Player)?.GetCurrentLocation()?.GetDistanceFrom(this) <= client.Tags?["Player"]?.ViewDistance).ToList();
        }
        public void CharacterArrives(Character CharacterObject)
        {
            CharacterObject.CurrentXYZ = StorageID;
            Occupants.Add(CharacterObject.Name);
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
                player.SendString(request);
            }
        }
        public void CharacterLeaves(Character CharacterObject)
        {
            var soul = CharacterObject.ConvertToSoul();
            var nearbyPlayers = GetNearbyPlayers();
            CharacterObject.CurrentXYZ = null;
            CharacterObject.PreviousXYZ = this.StorageID;
            Occupants.RemoveAll(name=>name == CharacterObject.Name);
            var request = JSON.Encode(new
            {
                Category = "Events",
                Type = "CharacterLeaves",
                Soul = soul
            });
            foreach (var player in nearbyPlayers)
            {
                player.SendString(request);
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
                    InvestedWillpower = this.InvestedWillpower
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
                    Title = this.Title
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
            Storage.Current.Locations.Add(location);
            return location;
        }
    }
}
