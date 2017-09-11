using After.Models;
//using Microsoft.CodeAnalysis.CSharp.Scripting;
using System;
using System.Text;
using System.Threading.Tasks;
using System.Web.Helpers;

namespace After.Message_Handlers
{
    public static class Messages
    {
        public static void HandleChat(dynamic JsonData, Socket_Handler SH)
        {
            string message = JsonData.Message;
            if (message.StartsWith("/"))
            {
                ParseCommand(JsonData, SH);
                return;
            }
            JsonData.Username = SH.Player.Name;
            Storage.Current.Messages.Add(new Message()
            {
                StorageID = $"{SH.Player.Name}-${DateTime.Now.ToString("yyyy-MM-dd HH.mm.ss.fff")}",
                LastAccessed = DateTime.Now,
                Sender = SH.Player.Name,
                Content = JsonData.Message,
                Recipient = JsonData?.Recipent,
                Channel = JsonData.Channel,
                Timestamp = DateTime.Now
            });
            switch ((string)JsonData.Channel)
            {
                case "Global":
                    Socket_Handler.SocketCollection.Broadcast(Json.Encode(JsonData));
                    break;
                case "Command":
                    ParseCommand(JsonData, SH);
                    break;
                default:
                    break;
            }
        }
        public static void HandleAdmin(dynamic JsonData, Socket_Handler SH)
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
            //SH.Send(Json.Encode(JsonData));
        }
        public static void ParseCommand(dynamic JsonData, Socket_Handler SH)
        {
            string message = JsonData.Message.ToLower();
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