using System;
using Microsoft.Web.WebSockets;
using System.Web.Helpers;
using System.IO;
using After.Models;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Threading;
using System.Data.Entity;

/// <summary>
/// Summary description for WebSocketHandler
/// </summary>

namespace After
{
    public class Socket_Handler : WebSocketHandler
    {
        public static WebSocketCollection SocketCollection { get; set; } = new WebSocketCollection();
        public bool Authenticated { get; set; }
        public Player Player { get; set; }
        public World World { get; set; } = new World();
        public World Backup { get; set; }
        public Socket_Handler()
        {

        }
        public override void OnOpen()
        {
            
        }
        public override void OnMessage(string message)
        {
            dynamic jsonMessage = Json.Decode(message);
            if (jsonMessage == null || String.IsNullOrEmpty(jsonMessage.Category) || String.IsNullOrEmpty(jsonMessage.Type))
            {
                throw new Exception("Category or Type is null within Socket_Handler.OnMessage.");
            }
            string category = jsonMessage.Category;
            string type = jsonMessage.Type;
            
            if (!Authenticated)
            {
                if (category != "Accounts" || (type != "Logon" && type != "AccountCreation"))
                {
                    Close();
                    return;
                }
            }
            var methodHandler = Type.GetType("After.Message_Handlers." + category).GetMethods().FirstOrDefault(mi => mi.Name == "Handle" + type);
            if (methodHandler != null)
            {
                World = new World();
                methodHandler.Invoke(null, new object[] { jsonMessage, this });
                Utilities.SaveTheWorld(World);
            }

        }

        public override void OnClose()
        {
            if (SocketCollection.Contains(this))
            {
                SocketCollection.Remove(this);
            }
            if (Player?.Name == null)
            {
                return;
            }
            dynamic message = new
            {
                Category = "Accounts",
                Type = "Disconnected",
                Username = Player.Name,
            };
            SocketCollection.Broadcast(Json.Encode(message));
            Utilities.SaveTheWorld(World);
        }
        public override void OnError()
        {
            if (SocketCollection.Contains(this))
            {
                SocketCollection.Remove(this);
            }
            if (Player?.Name == null)
            {
                return;
            }
            dynamic message = new
            {
                Category = "Accounts",
                Type = "Disconnected",
                Username = Player.Name,
            };
            SocketCollection.Broadcast(Json.Encode(message));
            Utilities.SaveTheWorld(World);
        }
    }
}