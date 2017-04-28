using After.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;

namespace After.Message_Handlers
{
    public static class Queries
    {
        public static void HandlePlayerUpdate(dynamic JsonMessage, Socket_Handler SH)
        {
            JsonMessage.Player = SH.Player.ConvertToMe();
            SH.Send(Json.Encode(JsonMessage));
        }
        public static void HandleRefreshView(dynamic JsonMessage, Socket_Handler SH)
        {
            var souls = new List<dynamic>();
            var areas = new List<dynamic>();
            var location = SH.Player.GetCurrentLocation();
            if (location == null)
            {
                return;
            }
            foreach (var area in location.GetNearbyLocations(SH.Player))
            {
                if (area.IsStatic == false && DateTime.Now - area.LastVisited > TimeSpan.FromMinutes(1))
                {
                    var request = new
                    {
                        Category = "Events",
                        Type = "AreaRemoved",
                        Area = area.ConvertToArea()
                    };
                    foreach (var player in area.GetNearbyPlayers())
                    {
                        player.Send(Json.Encode(request));
                    }
                    World.Current.Locations.Remove(area);
                    continue;
                }
                foreach (var character in World.Current.Characters.Where(p => p.CurrentXYZ == area.LocationID))
                {
                    if (character is Player && !(character as Player).IsLoggedIn())
                    {
                        continue;
                    }
                    souls.Add(character.ConvertToSoul());
                }
                areas.Add(area.ConvertToArea());
            }
            JsonMessage.Souls = souls;
            JsonMessage.Areas = areas;
            SH.Send(Json.Encode(JsonMessage));
        }
        public static void HandleRememberLocations(dynamic JsonMessage, Socket_Handler SH)
        {

        }
    }
}