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
            var location = SH.Player.GetCurrentLocation(SH.World);
            if (location == null)
            {
                return;
            }
            foreach (var area in location.GetNearbyLocations(SH.World, SH.Player))
            {
                foreach (var character in SH.World.Characters.Where(p => p.CurrentXYZ == area.LocationID))
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