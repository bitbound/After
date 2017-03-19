using System;
using Microsoft.Web.WebSockets;
using System.Web.Helpers;
using System.IO;
using After.Models;
using System.Linq;
using System.Collections.Generic;

/// <summary>
/// Summary description for WebSocketHandler
/// </summary>

namespace After
{
    public class SocketHandler : WebSocketHandler
    {
        public static WebSocketCollection SocketCollection { get; set; } = new WebSocketCollection();
        public bool Authenticated { get; set; }
        public Player Player { get; set; } = new Player();
        public SocketHandler()
        {
        }
        public override void OnOpen()
        {
            SocketCollection.Add(this);
        }
        public override void OnMessage(string message)
        {
            dynamic jsonMessage = Json.Decode(message);
            if (jsonMessage == null || String.IsNullOrEmpty(jsonMessage.Type))
            {
                throw new Exception("Type is null within SocketHandler.OnMessage.");
            }

            string type = jsonMessage.Type;

            if (type != "AccountCreation" && type != "Logon" && !Authenticated)
            {
                Close();
                return;
            }
            var methodHandler = Type.GetType("After.SocketHandler").GetMethods().FirstOrDefault(mi => mi.Name == "Handle" + type);
            if (methodHandler != null)
            {
                methodHandler.Invoke(this, new object[] { jsonMessage });
            }
        }

        public override void OnClose()
        {
            SocketCollection.Remove(this);
            if (Player?.Name == null)
            {
                return;
            }
            dynamic message = new
            {
                Type = "Logoff",
                Username = Player?.Name,
            };
            SocketCollection.Broadcast(Json.Encode(message));
        }
        public override void OnError()
        {
            SocketCollection.Remove(this);
            if (Player?.Name == null)
            {
                return;
            }
            dynamic message = new
            {
                Type = "Logoff",
                Username = Player?.Name,
            };
            SocketCollection.Broadcast(Json.Encode(message));
        }

        public void HandleAccountCreation(dynamic jsonMessage)
        {
            Player.Name = jsonMessage.Username;
            if (File.Exists(Utilities.App_Data + @"Accounts\" + Player.Name + ".json"))
            {
                jsonMessage.Result = "exists";
                jsonMessage.Password = null;
                this.Send(Json.Encode(jsonMessage));
                return;
            }
            else
            {
                Authenticated = true;
                Player.Color = jsonMessage.Color;
                Player.Password = Crypto.HashPassword(jsonMessage.Password);
                var newVoidArea = new Location() { XCoord = 0, YCoord = 0, ZCoord = Player.Name + ":0", Color = "gray", Static = true, Title = Player.Name + "'s Inner Void", IsInnerVoid = true };
                // TODO: Add Ferryman to void area.
                Player.CurrentLocation = newVoidArea;
                World.Current.Players.Add(Player);
                World.Current.SaveChanges();
                //File.WriteAllText(Utilities.App_Data + @"Accounts\" + Player.Name + ".json", Json.Encode(Player));
                jsonMessage.Result = "ok";
                jsonMessage.Password = null;
                SocketCollection.Broadcast(Json.Encode(jsonMessage));
            }
        }
        public void HandleLogon(dynamic jsonMessage)
        {
            Player.Name = jsonMessage.Username;
            if (!File.Exists(Utilities.App_Data + @"Accounts\" + Player.Name + ".json"))
            {
                jsonMessage.Result = "failed";
                this.Send(Json.Encode(jsonMessage));
                return;
            }
            var strAccount = File.ReadAllText(Utilities.App_Data + @"Accounts\" + Player.Name + ".json");
            var player = Json.Decode<Player>(strAccount);
            if (!Crypto.VerifyHashedPassword(player.Password, jsonMessage.Password))
            {
                jsonMessage.Result = "failed";
                this.Send(Json.Encode(jsonMessage));
                return;
            }
            Authenticated = true;
            jsonMessage.Result = "ok";
            SocketCollection.Broadcast(Json.Encode(jsonMessage));
        }
        public void HandleChat(dynamic jsonMessage)
        {
            jsonMessage.Username = Player.Name;
            SocketCollection.Broadcast(Json.Encode(jsonMessage));
        }
        public void HandleEvent(dynamic jsonMessage)
        {
            switch (jsonMessage.EventType as string)
            {
                case "StartCharging":
                    {
                        // TODO: Checks.
                        jsonMessage.Result = "ok";
                        Send(Json.Encode(jsonMessage));
                        Player.IsCharging = true;
                        var timer = new System.Timers.Timer(100);
                        timer.Elapsed += (sen, arg) => {
                            if (Player.IsCharging == false)
                            {
                                (sen as System.Timers.Timer).Stop();
                                (sen as System.Timers.Timer).Dispose();
                                return;
                            }
                            Player.CurrentCharge = Math.Min(Player.MaxCharge, Player.CurrentCharge + (Player.MaxCharge * 0.01));
                            dynamic update = new
                            {
                                Type = "Query",
                                QueryType = "StatUpdate",
                                Stat = "CurrentCharge",
                                Amount = Player.CurrentCharge,
                            };
                            Send(Json.Encode(update));
                        };
                        timer.Start();
                        break;
                    }
                case "StopCharging":
                    {
                        // TODO: Checks.
                        jsonMessage.Result = "ok";
                        Send(Json.Encode(jsonMessage));
                        Player.IsCharging = false;
                        var timer = new System.Timers.Timer(100);
                        timer.Elapsed += (sen, arg) => {
                            if (Player.IsCharging == true || Player.CurrentCharge == 0)
                            {
                                (sen as System.Timers.Timer).Stop();
                                (sen as System.Timers.Timer).Dispose();
                                return;
                            }
                            Player.CurrentCharge = Math.Max(0, Player.CurrentCharge - (Player.MaxCharge * 0.01));
                            dynamic update = new
                            {
                                Type = "Query",
                                QueryType = "StatUpdate",
                                Stat = "CurrentCharge",
                                Amount = Player.CurrentCharge,
                            };
                            Send(Json.Encode(update));
                        };
                        timer.Start();
                        break;
                    }
                default:
                    break;
            }
        }
        public void HandleQuery(dynamic jsonMessage)
        {
            switch (jsonMessage.QueryType as string)
            {
                case "PlayerUpdate":
                    {
                        jsonMessage.Player = Player;
                        Send(Json.Encode(jsonMessage));
                        break;
                    }
                case "FirstLoad":
                    {
                        jsonMessage.Player = Player;
                        var souls = new List<dynamic>
                        {
                            new
                            {
                                Name = Player.Name,
                                Color = Player.Color,
                                XCoord = Player.CurrentLocation.XCoord,
                                YCoord = Player.CurrentLocation.YCoord,
                                ZCoord = Player.CurrentLocation.ZCoord
                            }
                        };
                        jsonMessage.Souls = souls;
                        // TODO: Add nearby souls.
                        Send(Json.Encode(jsonMessage));
                        break;
                    }
                default:
                    break;
            }
        }
    }
}