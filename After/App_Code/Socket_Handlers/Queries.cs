using After.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;

namespace After.Socket_Handlers
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
            var souls = new List<dynamic>
            {
                new
                {
                    Name = SH.Player.Name,
                    Color = SH.Player.Color,
                    XCoord = SH.Player.CurrentLocation.XCoord,
                    YCoord = SH.Player.CurrentLocation.YCoord,
                    ZCoord = SH.Player.CurrentLocation.ZCoord
                }
            };
            jsonMessage.Souls = souls;
            // TODO: Add nearby souls.
            var areas = new List<dynamic>();
            foreach (var area in World.Current.Locations.Where(l => l.ZCoord == SH.Player.CurrentLocation.ZCoord &&
            Math.Abs(l.XCoord - SH.Player.CurrentLocation.XCoord) <= SH.Player.ViewDistance &&
            Math.Abs(l.YCoord - SH.Player.CurrentLocation.YCoord) <= SH.Player.ViewDistance))
            {
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
            jsonMessage.Areas = areas;
            SH.Send(Json.Encode(jsonMessage));
        }
    }
}