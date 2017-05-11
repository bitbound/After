using System;
using Microsoft.Web.WebSockets;
using System.Web.Helpers;
using System.IO;
using After.Models;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Threading;
using System.Web;

/// <summary>
/// Summary description for WebSocketHandler
/// </summary>

namespace After
{
    public class Socket_Handler : WebSocketHandler
    {
        public static WebSocketCollection SocketCollection { get; set; } = new WebSocketCollection();
        public bool Authenticated { get; set; }
        public string Name { get; set; }
        public Player Player
        {
            get
            {
                return World.Current.Players.Find(Name);
            }
        }
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
                try
                {
                    methodHandler.Invoke(null, new object[] { jsonMessage, this });
                }
                catch (Exception ex)
                {
                    var filePath = Path.Combine(HttpContext.Current.Server.MapPath("~/App_Data/Errors/"), DateTime.Now.Year.ToString(), DateTime.Now.Month.ToString().PadLeft(2, '0'), DateTime.Now.Day.ToString().PadLeft(2, '0') + ".txt");
                    if (!Directory.Exists(Path.GetDirectoryName(filePath)))
                    {
                        Directory.CreateDirectory(System.IO.Path.GetDirectoryName(filePath));
                    }
                    var exError = ex;
                    while (exError != null)
                    {
                        var jsonError = new
                        {
                            Timestamp = DateTime.Now.ToString(),
                            Message = exError?.Message,
                            InnerEx = exError?.InnerException?.Message,
                            Source = exError?.Source,
                            StackTrace = exError?.StackTrace,
                        };
                        var error = System.Web.Helpers.Json.Encode(jsonError) + Environment.NewLine;
                        File.AppendAllText(filePath, error);
                        exError = exError.InnerException;
                    }
                }
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
            World.Current.Players.Store(Player.StorageID);
            Player.GetCurrentLocation()?.CharacterLeaves(Player);
            foreach (var timer in Player.Timers)
            {
                timer.Value.Stop();
                timer.Value.Dispose();
            }
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
            World.Current.Players.Store(Player.StorageID);
            Player.GetCurrentLocation()?.CharacterLeaves(Player);
            foreach (var timer in Player.Timers)
            {
                timer.Value.Stop();
                timer.Value.Dispose();
            }
        }
    }
}