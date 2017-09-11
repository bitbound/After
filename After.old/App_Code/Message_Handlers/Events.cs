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
            if (SH.Player.MovementState != Models.Character.MovementStates.Ready)
            {
                return;
            }
            SH.Player.StartCharging();
        }
        public static void HandleStopCharging(dynamic JsonMessage, Socket_Handler SH)
        {
            if (SH.Player.MovementState != Models.Character.MovementStates.Ready)
            {
                return;
            }
            SH.Player.StopCharging();
        }
        public static void HandlePlayerMove(dynamic JsonMessage, Socket_Handler SH)
        {
            if (SH.Player.MovementState != Models.Character.MovementStates.Ready)
            {
                return;
            }
            var xChange = 0;
            var yChange = 0;
            var dir = (string)JsonMessage.Direction;
            dir = dir.ToUpper();
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
            SH.Player.Move(destXYZ);
        }
    }
}