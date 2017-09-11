using After.Models;
using Newtonsoft.Json;
using System;
using System.Net.WebSockets;
using System.Text;
using Translucency.WebSockets;
using System.Linq;


namespace After.Message_Handlers
{
    public static class Messages
    {
        public static void HandleChat(dynamic JsonMessage, WebSocketClient WSC)
        {
            string message = JsonMessage.Message;
            if (message.StartsWith("/"))
            {
                ParseCommand(JsonMessage, WSC);
                return;
            }
            JsonMessage.Username = (WSC.Tags["Player"] as Player).Name;
            Storage.Current.Messages.Add(new Message()
            {
                StorageID = $"{(WSC.Tags["Player"] as Player).Name}-${DateTime.Now.ToString("yyyy-MM-dd HH.mm.ss.fff")}",
                LastAccessed = DateTime.Now,
                Sender = (WSC.Tags["Player"] as Player).Name,
                Content = JsonMessage.Message,
                Recipient = JsonMessage?.Recipent,
                Channel = JsonMessage.Channel,
                Timestamp = DateTime.Now
            });
            switch ((string)JsonMessage.Channel)
            {
                case "Global":
                    Utilities.Server.Broadcast(JsonConvert.SerializeObject(JsonMessage), WSC);
                    break;
                case "Command":
                    ParseCommand(JsonMessage, WSC);
                    break;
                default:
                    break;
            }
        }
        public static void HandleAdmin(dynamic JsonMessage, WebSocketClient WSC)
        {
            //if (SH?.Player?.AccountType != Player.AccountTypes.Admin)
            //{
            //    return;
            //}
            //try
            //{
            //    var result = CSharpScript.EvaluateAsync(JsonData.Message.ToString());
            //    result.Wait();
            //    JsonData.Message = result.Result;
            //}
            //catch (Exception ex)
            //{
            //    JsonData.Message = "Error: " + ex.Message;
            //}
            //WSC.SendString(JsonConvert.SerializeObject(JsonData));
        }
        public static void ParseCommand(dynamic JsonMessage, WebSocketClient WSC)
        {
            string message = JsonMessage.Message.ToLower();
            var commandArray = message.Split(' ');
            var command = commandArray[0].Replace("/", "");
            switch (command)
            {
                case "?":
                    {
                        var reply = new StringBuilder();
                        reply.AppendLine("");
                        reply.AppendLine("Command List:");
                        reply.AppendLine("/debug - Toggle debug mode.");
                        reply.AppendLine("/who - Display a list of online players.");
                        var request = new
                        {
                            Category = "Messages",
                            Type = "Chat",
                            Channel = "System",
                            Message = reply.ToString()
                        };
                        WSC.SendString(JsonConvert.SerializeObject(request));
                        break;
                    }
                case "who":
                    {
                        var reply = new StringBuilder();
                        reply.AppendLine("");
                        reply.AppendLine("Online Players:");
                        foreach (WebSocketClient wsc in Utilities.Server.ClientList.Where(cl=>!String.IsNullOrWhiteSpace(cl.Tags?["Player"]?.Name)))
                        {
                            reply.AppendLine((WSC.Tags["Player"] as Player).Name);
                        }
                        var request = new
                        {
                            Category = "Messages",
                            Type = "Chat",
                            Channel = "System",
                            Message = reply.ToString()
                        };
                        WSC.SendString(JsonConvert.SerializeObject(request));
                        break;
                    }
                default:
                    {
                        var request = new
                        {
                            Category = "Messages",
                            Type = "Chat",
                            Channel = "System",
                            Message = "Unknown command.  Type /? for a list of commands."
                        };
                        WSC.SendString(JsonConvert.SerializeObject(request));
                        break;
                    }
            }
        }
    }
}