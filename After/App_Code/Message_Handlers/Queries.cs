using After.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;

namespace After.Message_Handlers
{
    public static class Queries
    {
        public static void HandlePlayerUpdate(dynamic jsonMessage, Socket_Handler SH)
        {
            jsonMessage.Player = SH.Player;
            SH.Send(Json.Encode(jsonMessage));
        }
        public static void HandleFirstLoad(dynamic jsonMessage, Socket_Handler SH)
        {
            jsonMessage.Player = SH.Player.ConvertToMe();
            var souls = new List<dynamic>();
            var areas = new List<dynamic>();
            foreach (var area in SH.Player.GetCurrentLocation(SH.World).GetNearbyLocations(SH.World, SH.Player))
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
            jsonMessage.Souls = souls;
            jsonMessage.Areas = areas;
            SH.Send(Json.Encode(jsonMessage));
        }
    }
}