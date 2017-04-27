using After.Interactions;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web.Helpers;

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
        public bool IsStatic { get; set; }
        public DateTime? LastVisited { get; set; }
        public string LastVisitedBy { get; set; }
        public long InvestedWillpower { get; set; }
        public List<Character> GetOccupants(World Context)
        {
            var characters = Context.Characters.Where(p => p.CurrentXYZ == this.LocationID);
            if (characters != null)
            {
                return characters.ToList();
            }
            else
            {
                return null;
            };
        }
        public bool IsInnerVoid { get; set; }
        public long OwnerID { get; set; }
        public string Interactions { get; set; }

        public static bool Exists(string XYZ, Socket_Handler SH)
        {
            if (SH.World.Locations.FirstOrDefault(loc => loc.LocationID == XYZ) != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        public bool ContainsOccupant(World Context, Character CharacterObject)
        {
            return GetOccupants(Context).ToList().Exists(cha => cha.CharacterID == CharacterObject.CharacterID);
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
        public List<Location> GetNearbyLocations(World Context, Character CharacterObject)
        {
            var locations = Context.Locations.Where(l => l.ZCoord == this.ZCoord &&
                Math.Abs(l.XCoord - this.XCoord) <= CharacterObject.ViewDistance &&
                Math.Abs(l.YCoord - this.YCoord) <= CharacterObject.ViewDistance);
            return locations?.ToList();
        }
        public List<Socket_Handler> GetNearbyPlayers(World Context, Character CharacterObject)
        {
            return Socket_Handler.SocketCollection.Cast<Socket_Handler>().Where(sock => sock.Player.GetCurrentLocation(Context).GetDistanceFrom(this) <= sock.Player.ViewDistance).ToList();
        }
        public void CharacterArrives(World Context, Character CharacterObject)
        {
            CharacterObject.CurrentXYZ = LocationID;
            LastVisited = DateTime.Now;
            LastVisitedBy = CharacterObject.Name;
            var soul = CharacterObject.ConvertToSoul();
            var nearbyPlayers = GetNearbyPlayers(Context, CharacterObject);
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
        public void CharacterLeaves(World Context, Character CharacterObject)
        {
            var soul = CharacterObject.ConvertToSoul();
            var nearbyPlayers = GetNearbyPlayers(Context, CharacterObject);
            CharacterObject.CurrentXYZ = null;
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
                Type = "Area",
                XCoord = this.XCoord,
                YCoord = this.YCoord,
                ZCoord = this.ZCoord,
                LocationID = this.LocationID,
                Color = this.Color,
                Title = this.Title,
                Description = this.Description,
                InvestedWillpower = this.InvestedWillpower
            };
        }
    }
}
