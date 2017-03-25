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
            SH.Send(Json.Encode(jsonMessage));
        }
    }
}