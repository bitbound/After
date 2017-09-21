using After.Models;
using System.Threading.Tasks;
using Translucency.WebSockets;

namespace After.Message_Handlers
{
    public static class Events
    {
        public static async Task HandleStartCharging(dynamic JsonMessage, WebSocketClient WSC)
        {
            if ((WSC.Player as Player).MovementState != Models.Character.MovementStates.Ready)
            {
                return;
            }
            await (WSC.Player as Player).StartCharging();
        }
        public static async Task HandleStopCharging(dynamic JsonMessage, WebSocketClient WSC)
        {
            if ((WSC.Player as Player).MovementState != Models.Character.MovementStates.Ready)
            {
                return;
            }
            await (WSC.Player as Player).StopCharging();
        }
        public static async Task HandlePlayerMove(dynamic JsonMessage, WebSocketClient WSC)
        {
            if ((WSC.Player as Player).MovementState != Character.MovementStates.Ready)
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
            var currentXYZ = (WSC.Player as Player).CurrentXYZ.Split(',');
            var destXYZ = new string[3];
            destXYZ[0] = (double.Parse(currentXYZ[0]) + xChange).ToString();
            destXYZ[1] = (double.Parse(currentXYZ[1]) + yChange).ToString();
            destXYZ[2] = currentXYZ[2];
            await (WSC.Player as Player).Move(destXYZ);
        }
        public static async Task HandleDoAreaAction(dynamic JsonMessage, WebSocketClient WSC)
        {
            await Task.Delay(1);
            // TODO.
        }
        public static async Task HandleAreaOccupantClicked(dynamic JsonMessage, WebSocketClient WSC)
        {
            await Task.Delay(1);
            // TODO.
        }
    }
}