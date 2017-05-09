using After.Interactions;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Timers;
using System.Web.Helpers;

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
        public DateTime LastVisited { get; set; }
        public string LastVisitedBy { get; set; }
        public long InvestedWillpower { get; set; }
        public List<string> Occupants { get; set; } = new List<string>();
        public bool IsInnerVoid { get; set; }
        public long OwnerID { get; set; }
        public string Interactions { get; set; }
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
        public List<Socket_Handler> GetNearbyPlayers()
        {
            return Socket_Handler.SocketCollection.Cast<Socket_Handler>().Where(sock => sock.Player.GetCurrentLocation()?.GetDistanceFrom(this) <= sock.Player.ViewDistance).ToList();
        }
        public void CharacterArrives(Character CharacterObject)
        {
            CharacterObject.CurrentXYZ = StorageID;
            Occupants.Add(CharacterObject.Name);
            LastVisited = DateTime.Now;
            LastVisitedBy = CharacterObject.Name;
            var soul = CharacterObject.ConvertToSoul();
            var nearbyPlayers = GetNearbyPlayers();
            var request = Json.Encode(new
            {
                Category = "Events",
                Type = "CharacterArrives",
                Soul = soul
            });
            foreach (var player in nearbyPlayers)
            {
                player.Send(request);
            }
        }
        public void CharacterLeaves(Character CharacterObject)
        {
            var soul = CharacterObject.ConvertToSoul();
            var nearbyPlayers = GetNearbyPlayers();
            CharacterObject.CurrentXYZ = null;
            CharacterObject.PreviousXYZ = this.StorageID;
            Occupants.RemoveAll(name=>name == CharacterObject.Name);
            var request = Json.Encode(new
            {
                Category = "Events",
                Type = "CharacterLeaves",
                Soul = soul
            });
            foreach (var player in nearbyPlayers)
            {
                player.Send(request);
            }
        }
        public dynamic ConvertToArea()
        {
            return new
            {
                XCoord = this.XCoord,
                YCoord = this.YCoord,
                ZCoord = this.ZCoord,
                StorageID = this.StorageID,
                Color = this.Color,
                Title = this.Title,
                Description = this.Description,
                InvestedWillpower = this.InvestedWillpower,
                Occupants = this.Occupants
            };
        }
    }
}
