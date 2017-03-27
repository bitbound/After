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
            jsonMessage.Player = SH.Player;
            var souls = new List<dynamic>();
            var areas = new List<dynamic>();
            foreach (var area in SH.Player.CurrentLocation.GetNearbyLocations(SH.Player.ViewDistance))
            {
                foreach (var character in area.Occupants)
                {
                    souls.Add(
                        new
                        {
                            Name = character.Name,
                            Color = character.Color,
                            XCoord = area.XCoord,
                            YCoord = area.YCoord,
                            ZCoord = area.ZCoord
                        }
                    );
                }

                areas.Add(new
                {
                    Type = "Area",
                    XCoord = area.XCoord,
                    YCoord = area.YCoord,
                    ZCoord = area.ZCoord,
                    Color = area.Color,
                    Title = area.Title,
                    Description = area.Description,
                    InvestedWillpower = area.InvestedWillpower
                });
            }
            jsonMessage.Souls = souls;
            jsonMessage.Areas = areas;
            SH.Send(Json.Encode(jsonMessage));
        }
    }
}