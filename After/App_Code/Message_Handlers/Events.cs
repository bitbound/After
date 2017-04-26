using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Helpers;

namespace After.Message_Handlers
{
    public static class Events
    {
        public static void HandleStartCharging(dynamic JsonMessage, Socket_Handler SH)
        {
            // TODO: Checks.
            JsonMessage.Result = "ok";
            SH.Send(Json.Encode(JsonMessage));
            SH.Player.IsCharging = true;
            var timer = new System.Timers.Timer(100);
            timer.Elapsed += (sen, arg) => {
                if (SH.Player.IsCharging == false)
                {
                    (sen as System.Timers.Timer).Stop();
                    (sen as System.Timers.Timer).Dispose();
                    return;
                }
                SH.Player.CurrentCharge = Math.Min(SH.Player.MaxCharge, SH.Player.CurrentCharge + (SH.Player.MaxCharge * 0.01));
                dynamic update = new
                {
                    Category = "Queries",
                    Type = "StatUpdate",
                    Stat = "CurrentCharge",
                    Amount = SH.Player.CurrentCharge
                };
                SH.Send(Json.Encode(update));
            };
            timer.Start();
        }
        public static void HandleStopCharging(dynamic JsonMessage, Socket_Handler SH)
        {
            // TODO: Checks.
            JsonMessage.Result = "ok";
            SH.Send(Json.Encode(JsonMessage));
            SH.Player.IsCharging = false;
            var timer = new System.Timers.Timer(100);
            timer.Elapsed += (sen, arg) => {
                if (SH.Player.IsCharging == true || SH.Player.CurrentCharge == 0)
                {
                    (sen as System.Timers.Timer).Stop();
                    (sen as System.Timers.Timer).Dispose();
                    return;
                }
                SH.Player.CurrentCharge = Math.Max(0, SH.Player.CurrentCharge - (SH.Player.MaxCharge * 0.01));
                dynamic update = new
                {
                    Category = "Queries",
                    Type = "StatUpdate",
                    Stat = "CurrentCharge",
                    Amount = SH.Player.CurrentCharge
                };
                SH.Send(Json.Encode(update));
            };
            timer.Start();
        }
        public static void HandlePlayerMove(dynamic JsonMessage, Socket_Handler SH)
        {
            var destArray = SH.Player.CurrentXYZ.Split(',');
            var xChange = 0;
            var yChange = 0;
            string dir = JsonMessage.Direction.ToUpper();
            if (dir.Contains("N"))
            {
                yChange--;
            }
            else if (dir.Contains("S"))
            {
                yChange++;
            }
            if (dir.Contains("E"))
            {
                xChange++;
            }
            else if (dir.Contains("W"))
            {
                xChange--;
            }
            destArray[0] = (double.Parse(destArray[0]) + xChange).ToString();
            destArray[1] = (double.Parse(destArray[1]) + yChange).ToString();
            var dest = SH.World.Locations.Find($"{destArray[0]},{destArray[1]},{destArray[2]}");
            if (dest != null)
            {
                var soul = SH.Player.ConvertToSoul();
                var currentLocation = SH.Player.GetCurrentLocation(SH);
                var distance = currentLocation.GetDistanceFrom(dest);
                var travelTime = distance * 1000;
                var nearbyPlayers = currentLocation.GetNearbyPlayers(SH);
                foreach (var player in dest.GetNearbyPlayers(SH))
                {
                    if (!nearbyPlayers.Contains(player))
                    {
                        nearbyPlayers.Add(player);
                    }
                }
                currentLocation.CharacterLeaves(SH.Player, SH);
                var request = Json.Encode(new
                {
                    Category = "Events",
                    Type = "PlayerMove",
                    Soul = soul,
                    From = currentLocation.LocationID,
                    To = dest.LocationID,
                    TravelTime = travelTime
                });
                foreach (var player in nearbyPlayers)
                {
                    player.Send(request);
                }
                Thread.Sleep((int)(Math.Round(travelTime)));
                SH.Player.CurrentXYZ = dest.LocationID;
                dest.CharacterArrives(SH.Player, SH);
            }
        }
    }
}