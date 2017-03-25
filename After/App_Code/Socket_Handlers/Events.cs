using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;

namespace After.Socket_Handlers
{
    public static class Events
    {
        public static void HandleStartCharging(dynamic jsonMessage, Socket_Handler SH)
        {
            // TODO: Checks.
            jsonMessage.Result = "ok";
            SH.Send(Json.Encode(jsonMessage));
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
        public static void HandleStopCharging(dynamic jsonMessage, Socket_Handler SH)
        {
            // TODO: Checks.
            jsonMessage.Result = "ok";
            SH.Send(Json.Encode(jsonMessage));
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
    }
}