using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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
            var startTime = DateTime.Now;
            var startValue = SH.Player.CurrentCharge;
            timer.Elapsed += (sen, arg) => {
                if (SH.Player.IsCharging == false)
                {
                    (sen as System.Timers.Timer).Stop();
                    (sen as System.Timers.Timer).Dispose();
                    return;
                }
                SH.Player.CurrentCharge = Math.Min(SH.Player.MaxCharge, Math.Round(startValue + (DateTime.Now - startTime).TotalMilliseconds / 100 * .01 * SH.Player.MaxCharge));
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
            var startTime = DateTime.Now;
            var startValue = SH.Player.CurrentCharge;
            timer.Elapsed += (sen, arg) => {
                if (SH.Player.IsCharging == true || SH.Player.CurrentCharge == 0)
                {
                    (sen as System.Timers.Timer).Stop();
                    (sen as System.Timers.Timer).Dispose();
                    return;
                }
                SH.Player.CurrentCharge = Math.Max(0, Math.Round(startValue - (DateTime.Now - startTime).TotalMilliseconds / 100 * .01 * SH.Player.MaxCharge));
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
            if (SH.Player.MovementState != Models.Character.MovementStates.Ready)
            {
                return;
            }
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
            var currentXYZ = SH.Player.CurrentXYZ.Split(',');
            var destXYZ = new string[3];
            destXYZ[0] = (double.Parse(currentXYZ[0]) + xChange).ToString();
            destXYZ[1] = (double.Parse(currentXYZ[1]) + yChange).ToString();
            destXYZ[2] = currentXYZ[2];
            SH.Player.Move(SH.World, destXYZ);
        }
    }
}