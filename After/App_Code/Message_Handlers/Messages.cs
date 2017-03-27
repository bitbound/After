using After.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;

namespace After.Message_Handlers
{
    public static class Messages
    {
        public static void HandleChat(dynamic jsonMessage, Socket_Handler SH)
        {
            jsonMessage.Username = SH.Player.Name;
            switch ((string)jsonMessage.Channel)
            {
                case "Global":
                    Socket_Handler.SocketCollection.Broadcast(Json.Encode(jsonMessage));
                    break;
                default:
                    break;
            }
        }
    }
}