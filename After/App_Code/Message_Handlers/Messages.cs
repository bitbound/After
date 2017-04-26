using After.Models;
using System;
using System.Text;
using System.Web.Helpers;

namespace After.Message_Handlers
{
    public static class Messages
    {
        public static void HandleChat(dynamic jsonMessage, Socket_Handler SH)
        {
            string message = jsonMessage.Message;
            if (message.StartsWith("/"))
            {
                ParseCommand(jsonMessage, SH);
                return;
            }
            jsonMessage.Username = SH.Player.Name;
            SH.World.Messages.Add(new Message()
            {
                Sender = SH.Player.Name,
                Content = jsonMessage.Message,
                Recipient = jsonMessage?.Recipent,
                Channel = jsonMessage.Channel,
                Timestamp = DateTime.Now
            });
            switch ((string)jsonMessage.Channel)
            {
                case "Global":
                    Socket_Handler.SocketCollection.Broadcast(Json.Encode(jsonMessage));
                    break;
                case "Command":
                    ParseCommand(jsonMessage, SH);
                    break;
                default:
                    break;
            }
        }
        public static void ParseCommand(dynamic jsonMessage, Socket_Handler SH)
        {
            string message = jsonMessage.Message.ToLower();
            var commandArray = message.Split(' ');
            var command = commandArray[0].Replace("/", "");
            switch (command)
            {
                case "?":
                    {
                        var reply = new StringBuilder();
                        reply.AppendLine("");
                        reply.AppendLine("Command List:");
                        reply.AppendLine("/who - Display a list of online players.");
                        var request = new
                        {
                            Category = "Messages",
                            Type = "Chat",
                            Channel = "System",
                            Message = reply.ToString()
                        };
                        SH.Send(Json.Encode(request));
                        break;
                    }
                case "who":
                    {
                        var reply = new StringBuilder();
                        reply.AppendLine("");
                        reply.AppendLine("Online Players:");
                        foreach (Socket_Handler sh in Socket_Handler.SocketCollection)
                        {
                            reply.AppendLine(sh.Player.Name);
                        }
                        var request = new
                        {
                            Category = "Messages",
                            Type = "Chat",
                            Channel = "System",
                            Message = reply.ToString()
                        };
                        SH.Send(Json.Encode(request));
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
                        SH.Send(Json.Encode(request));
                        break;
                    }
            }
        }
    }
}