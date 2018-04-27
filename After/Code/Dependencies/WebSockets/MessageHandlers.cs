using After.Models;
using After.Scripting;
using Microsoft.AspNetCore.Identity;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using After.Dependencies;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using After.Dependencies.WebSockets;

namespace After.Code.Classes.WebSockets
{
    public static class MessageHandlers
    {
        #region Accounts
        public static async Task ReceiveAccountCreation(dynamic JsonMessage, WebSocketClient WSC)
        {
            string username = JsonMessage.Username.ToString().Trim();
            if (Storage.Current.Players.Exists(username))
            {
                JsonMessage.Result = "exists";
                JsonMessage.Password = null;
                WSC.SendJSON(JsonMessage);
                return;
            }
            else
            {
                var player = new Player()
                {
                    Name = username,
                    DisplayName = username,
                    Email = JsonMessage.Email,
                    Color = JsonMessage.Color,
                    // TODO: Start in void.
                    CurrentXYZ = $"0,0,{username}-0",
                    MovementState = Character.MovementStates.Ready
                };

                var innerVoid = new Location()
                {
                    Title = $"{username}'s Inner Void",
                    Description = "This is a plane of existence that lies within your own soul.",
                    OwnerID = username,
                    IsStatic = true,
                    StorageID = player.CurrentXYZ,
                    LastVisited = DateTime.Now,
                    Color = player.Color
                };
                Storage.Current.Locations.Add(innerVoid);
                var norahc = new NPC()
                {
                    Name = "Norahc",
                    DisplayName = "Norahc",
                    StorageID = Guid.NewGuid().ToString(),
                    CurrentXYZ = player.CurrentXYZ,
                    Color = "lightsteelblue",
                    CoreEnergy = 50000,
                    ViewDistance = 5,
                    MovementState = Character.MovementStates.Ready,
                    PortraitUri = "/Assets/Images/Portraits/Norahc.png"
                };
                norahc.Scripts.Add(new NPCScript()
                {
                    Trigger = Triggers.OnBecomeAware,
                    TriggerSources = new List<Type>() { typeof(Player) },
                    ScriptText = @""

                });
                Storage.Current.NPCs.Add(norahc);
                innerVoid.Occupants.Add(new Occupant() { DisplayName = norahc.DisplayName, StorageID = norahc.StorageID });

                var hasher = new PasswordHasher<Player>();
                player.Password = hasher.HashPassword(player, JsonMessage.Password.ToString());
                WSC.IsAuthenticated = true;
                WSC.Player = player;
                player.AuthenticationTokens.Add(Guid.NewGuid().ToString());
                Storage.Current.Players.Add(player);
                JsonMessage.Result = "ok";
                JsonMessage.Password = null;
                JsonMessage.AuthenticationToken = player.AuthenticationTokens.Last();
                WSC.SendJSON(JsonMessage);
                await App.Server.Broadcast(JSON.Encode(new
                {
                    Category = "Accounts",
                    Type = "Connected",
                    Username = player.Name
                }));
                App.Server.ClientList.Add(WSC);
            }
        }
        public static async Task ReceiveLogon(dynamic JsonMessage, WebSocketClient WSC)
        {
            var username = (string)JsonMessage.Username.ToString().Trim();
            if (!Storage.Current.Players.Exists(username))
            {
                JsonMessage.Result = "failed";
                await WSC.SendString(JSON.Encode(JsonMessage));
                return;
            }
            var player = Storage.Current.Players.Find(username);
            var hasher = new PasswordHasher<Player>();
            var clientList = WebSocketServer.ServerList["After"].ClientList;
            if (player.IsBanned)
            {
                JsonMessage.Result = "banned";
                await WSC.SendJSON(JsonMessage);
                await WSC.ClientSocket.CloseAsync(System.Net.WebSockets.WebSocketCloseStatus.NormalClosure, "Account banned.", CancellationToken.None);
                WSC.ClientSocket.Dispose();
                return;
            }
            while (player.AuthenticationTokens.Count > 10)
            {
                player.AuthenticationTokens.RemoveAt(0);
            }
            if (player.BadLoginAttempts >= 3)
            {
                if (DateTime.Now - player.LastBadLogin > TimeSpan.FromMinutes(10))
                {
                    player.BadLoginAttempts = 0;
                }
                else
                {
                    JsonMessage.Result = "locked";
                    await WSC.SendString(JSON.Encode(JsonMessage));
                    return;
                }
            }
            if (JsonMessage.Password == player.TemporaryPassword)
            {
                if (String.IsNullOrEmpty(JsonMessage.NewPassword))
                {
                    JsonMessage.Result = "new required";
                    await WSC.SendString(JSON.Encode(JsonMessage));
                    return;
                }
                else if (JsonMessage.NewPassword != JsonMessage.ConfirmNewPassword)
                {
                    JsonMessage.Result = "password mismatch";
                    await WSC.SendString(JSON.Encode(JsonMessage));
                    return;
                }
                else
                {
                    var authToken = Guid.NewGuid().ToString();
                    player.AuthenticationTokens.Add(authToken);
                    player.TemporaryPassword = "";
                    player.BadLoginAttempts = 0;
                    player.Password = hasher.HashPassword(WSC.Player as Player, JsonMessage.ConfirmNewPassword);
                }
            }
            else if (player.AuthenticationTokens.Count > 0 && JsonMessage.AuthenticationToken != null)
            {
                if (!player.AuthenticationTokens.Contains(JsonMessage.AuthenticationToken))
                {
                    JsonMessage.Result = "expired";
                    await WSC.SendString(JSON.Encode(JsonMessage));
                    return;
                }
                else
                {
                    player.AuthenticationTokens.Remove(JsonMessage.AuthenicationToken);
                }
            }
            else if (hasher.VerifyHashedPassword(player, player.Password, JsonMessage.Password) == PasswordVerificationResult.Failed)
            {
                player.BadLoginAttempts++;
                player.LastBadLogin = DateTime.Now;
                JsonMessage.Result = "failed";
                await WSC.SendString(JSON.Encode(JsonMessage));
                return;
            }
            else if (hasher.VerifyHashedPassword(player, player.Password, JsonMessage.Password) == PasswordVerificationResult.SuccessRehashNeeded)
            {
                player.Password = hasher.HashPassword(player, JsonMessage.Password);
            }
            if (clientList.Exists(s => (s as WebSocketClient)?.Player?.Name.ToLower() == username.ToLower()))
            {
                var existing = clientList.FindAll(s => (s as WebSocketClient)?.Player?.Name.ToLower() == username.ToLower());
                var message = new
                {
                    Category = "Accounts",
                    Type = "LoginElsewhere"
                };
                for (int i = existing.Count - 1; i >= 0; i--)
                {
                    clientList.Remove(existing[i]);
                    await existing[i].SendString(JSON.Encode(message));
                    await existing[i].ClientSocket.CloseAsync(System.Net.WebSockets.WebSocketCloseStatus.NormalClosure, null, CancellationToken.None);
                    existing[i].ClientSocket.Dispose();
                }
            }
            player.BadLoginAttempts = 0;
            WSC.Player = player;
            WSC.IsAuthenticated = true;
            player.IsCharging = false;
            player.CurrentCharge = 0;
            player.MovementState = Character.MovementStates.Ready;
            JsonMessage.Result = "ok";
            var newToken = Guid.NewGuid().ToString();
            player.AuthenticationTokens.Add(newToken);
            JsonMessage.AuthenticationToken = newToken;
            WSC.SendString(JSON.Encode(JsonMessage));
            await App.Server.Broadcast(JSON.Encode(new
            {
                Category = "Accounts",
                Type = "Connected",
                Username = (WSC.Player as Player).Name
            }));
            App.Server.ClientList.Add(WSC);
        }
        public static void ReceiveChangeSetting(dynamic JsonMessage, WebSocketClient WSC)
        {
            string prop = JsonMessage.Property;
            (WSC.Player as Player).Settings.GetType().GetProperty(prop).SetValue((WSC.Player as Player).Settings, JsonMessage.Value);
        }
        public static async Task ReceiveForgotPassword(dynamic JsonMessage, WebSocketClient WSC)
        {
            try
            {
                var username = JsonMessage.Username;
                if (string.IsNullOrWhiteSpace(username))
                {
                    JsonMessage.Result = "empty";
                    await WSC.SendString(JSON.Encode(JsonMessage));
                    return;
                }
                if (!Storage.Current.Players.Exists(username))
                {
                    JsonMessage.Result = "unknown";
                    await WSC.SendString(JSON.Encode(JsonMessage));
                    return;
                }
                Player account = Storage.Current.Players.Find(username);
                if (string.IsNullOrWhiteSpace(account.Email))
                {
                    JsonMessage.Result = "no email";
                    await WSC.SendString(JSON.Encode(JsonMessage));
                    return;
                }
                account.TemporaryPassword = Path.GetRandomFileName().Replace(".", "");
                JsonMessage.Result = "ok";
                JsonMessage.TemporaryPassword = account.TemporaryPassword;
                var request = new
                {
                    Email = account.Email,
                    Subject = "Password Reset for After",
                    Message = File.ReadAllText(Path.Combine(App.RootPath, "Docs\\PasswordResetTemplate.html")).Replace("#password#", account.TemporaryPassword)
                };
                var wr = WebRequest.CreateHttp("https://invis.me/Services/SendEmail");
                wr.Method = "POST";
                using (var rs = wr.GetRequestStream())
                {
                    using (var sw = new StreamWriter(rs))
                    {
                        sw.Write(JSON.Encode(request));
                    }
                }
                wr.GetResponse();
                await WSC.SendString(JSON.Encode(JsonMessage));
            }
            catch (Exception ex)
            {
                Utilities.WriteError(ex);
                JsonMessage.Result = "failed";
                await WSC.SendString(JSON.Encode(JsonMessage));
            }
        }
        #endregion Accounts

        #region Events
        public static async Task ReceiveStartCharging(dynamic JsonMessage, WebSocketClient WSC)
        {
            if ((WSC.Player as Player).MovementState != Models.Character.MovementStates.Ready)
            {
                return;
            }
            await (WSC.Player as Player).StartCharging();
        }
        public static async Task ReceiveStopCharging(dynamic JsonMessage, WebSocketClient WSC)
        {
            if ((WSC.Player as Player).MovementState != Models.Character.MovementStates.Ready)
            {
                return;
            }
            await (WSC.Player as Player).StopCharging();
        }
        public static async Task ReceivePlayerMove(dynamic JsonMessage, WebSocketClient WSC)
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
        public static async Task ReceiveDoAreaAction(dynamic JsonMessage, WebSocketClient WSC)
        {
            await Task.Delay(1);
            // TODO.
        }
        public static async Task ReceiveAreaOccupantClicked(dynamic JsonMessage, WebSocketClient WSC)
        {
            await Task.Delay(1);
            // TODO.
        }
        #endregion Events

        #region Messages
        public static async Task ReceiveChat(dynamic JsonMessage, WebSocketClient WSC)
        {
            string message = JsonMessage.Message;
            if (message.StartsWith("/"))
            {
                await ParseCommand(JsonMessage, WSC);
                return;
            }
            JsonMessage.Username = WSC?.Player?.Name;
            Storage.Current.Messages.Add(new Message()
            {
                StorageID = $"{WSC?.Player?.Name}-${DateTime.Now.ToString("yyyy-MM-dd HH.mm.ss.fff")}",
                LastAccessed = DateTime.Now,
                Sender = WSC?.Player?.Name,
                Content = JsonMessage?.Message,
                Recipient = JsonMessage?.Recipent,
                Channel = JsonMessage?.Channel,
                Timestamp = DateTime.Now
            });
            switch ((string)JsonMessage.Channel)
            {
                case "Global":
                    await App.Server.Broadcast(JSON.Encode(JsonMessage));
                    break;
                case "Command":
                    await ParseCommand(JsonMessage, WSC);
                    break;
                default:
                    break;
            }
        }
        public static async Task ReceiveAdminScript(dynamic JsonMessage, WebSocketClient WSC)
        {
            if (WSC?.Player?.AccountType != Player.AccountTypes.Admin)
            {
                return;
            }
            try
            {
                var result = await CSharpScript.EvaluateAsync(JsonMessage.Message, ScriptOptions.Default.WithReferences("After"), Storage.Current);
                JsonMessage.Message = result;
                await WSC.SendString(JSON.Encode(JsonMessage));
            }
            catch (Exception ex)
            {
                JsonMessage.Message = "Error: " + ex.Message;
                await WSC.SendString(JSON.Encode(JsonMessage));
            }
        }
        public static async Task ParseCommand(dynamic JsonMessage, WebSocketClient WSC)
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
                        await WSC.SendString(JSON.Encode(request));
                        break;
                    }
                case "who":
                    {
                        var reply = new StringBuilder();
                        reply.AppendLine("");
                        reply.AppendLine("Online Players:");
                        foreach (WebSocketClient wsc in App.Server.ClientList.Where(cl => !String.IsNullOrWhiteSpace(cl?.Player?.Name)))
                        {
                            reply.AppendLine((WSC.Player as Player).Name);
                        }
                        var request = new
                        {
                            Category = "Messages",
                            Type = "Chat",
                            Channel = "System",
                            Message = reply.ToString()
                        };
                        await WSC.SendString(JSON.Encode(request));
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
                        await WSC.SendString(JSON.Encode(request));
                        break;
                    }
            }
        }
        #endregion Messages


        #region Queries
        public static async Task ReceivePlayerUpdate(dynamic JsonMessage, WebSocketClient WSC)
        {
            JsonMessage.Player = (WSC.Player as Player).ConvertToMe();
            await WSC.SendString(JSON.Encode(JsonMessage));
        }
        public static async Task ReceiveRefreshView(dynamic JsonMessage, WebSocketClient WSC)
        {
            var souls = new List<dynamic>();
            var areas = new List<dynamic>();
            var location = (WSC.Player as Player).GetCurrentLocation();
            if (location == null)
            {
                return;
            }
            foreach (var area in (WSC.Player as Player).GetVisibleLocations())
            {
                if (area.IsStatic == false && DateTime.Now - area.LastVisited > TimeSpan.FromMinutes(1) && area.Occupants.Count == 0)
                {
                    var request = new
                    {
                        Category = "Events",
                        Type = "AreaRemoved",
                        Area = area.ConvertToArea(true)
                    };
                    foreach (var player in area.GetNearbyPlayers())
                    {
                        await player.SendString(JSON.Encode(request));
                    }
                    Storage.Current.Locations.Remove(area.StorageID);
                    continue;
                }
                foreach (var occupant in area.Occupants)
                {
                    Character character = Storage.Current.NPCs.Find(occupant.StorageID);
                    if (character == null)
                    {
                        character = Storage.Current.Players.Find(occupant.StorageID);
                        if (character == null)
                        {
                            continue;
                        }
                    }
                    if (character is Player && !(character as Player).IsLoggedIn())
                    {
                        continue;
                    }
                    souls.Add(character.ConvertToSoul());
                }
                areas.Add(area.ConvertToArea(true));
            }
            JsonMessage.Souls = souls;
            JsonMessage.Areas = areas;
            WSC.SendString(JSON.Encode(JsonMessage));
        }

        public static async Task ReceiveGetPowers(dynamic JsonMessage, WebSocketClient WSC)
        {
            JsonMessage.Powers = (WSC.Player as Player).Powers;
            await WSC.SendString(JSON.Encode(JsonMessage));
        }
        public static async Task ReceiveFirstLoad(dynamic JsonMessage, WebSocketClient WSC)
        {
            if (String.IsNullOrWhiteSpace((WSC.Player as Player).CurrentXYZ))
            {
                if (String.IsNullOrWhiteSpace((WSC.Player as Player).PreviousXYZ))
                {
                    (WSC.Player as Player).CurrentXYZ = "0,0,0";
                }
                else
                {
                    (WSC.Player as Player).CurrentXYZ = (WSC.Player as Player).PreviousXYZ;
                }
            }
            if (!Storage.Current.Locations.Exists((WSC.Player as Player).CurrentXYZ))
            {
                (WSC.Player as Player).CurrentXYZ = "0,0,0";
            }
            JsonMessage.Settings = (WSC.Player as Player).Settings;
            JsonMessage.Player = (WSC.Player as Player).ConvertToMe();
            JsonMessage.Powers = (WSC.Player as Player).Powers;
            JsonMessage.AccountType = (WSC.Player as Player).AccountType;
            WSC.SendString(JSON.Encode(JsonMessage));

            await (WSC.Player as Player).GetCurrentLocation().CharacterArrives((WSC.Player as Player));
        }
        public static async Task ReceiveMapUpdate(dynamic JsonMessage, WebSocketClient WSC)
        {
            if (JsonMessage.XMax - JsonMessage.XMin > 500)
            {
                await WSC.Player.WarnOrBan(WSC);
            }
            await Task.Run(async () => {
                var visibleLocations = (WSC.Player as Player).GetVisibleLocations();
                for (var x = JsonMessage.XMin; x <= JsonMessage.XMax; x++)
                {
                    for (var y = JsonMessage.YMin; y <= JsonMessage.YMax; y++)
                    {
                        var location = Storage.Current.Locations.Find($"{x},{y},{(WSC.Player as Player).ZCoord}");
                        if (location != null)
                        {
                            if (location.IsStatic == false && DateTime.Now - location.LastVisited > TimeSpan.FromMinutes(1) && location.Occupants.Count == 0)
                            {
                                var request = new
                                {
                                    Category = "Events",
                                    Type = "AreaRemoved",
                                    Area = location.ConvertToArea(true)
                                };
                                foreach (var player in location.GetNearbyPlayers())
                                {
                                    await player.SendString(JSON.Encode(request));
                                }
                                Storage.Current.Locations.Remove(location.StorageID);
                            }
                            else if (visibleLocations.Contains(location))
                            {
                                var request = new
                                {
                                    Category = "Queries",
                                    Type = "MapUpdate",
                                    Area = location.ConvertToArea(true)
                                };
                                await WSC.SendString(JSON.Encode(request));
                            }
                            else
                            {
                                var request = new
                                {
                                    Category = "Queries",
                                    Type = "MapUpdate",
                                    Area = location.ConvertToArea(false)
                                };
                                await WSC.SendString(JSON.Encode(request));
                            }
                        }
                    }
                }
                var done = new
                {
                    Category = "Queries",
                    Type = "MapUpdate",
                    Completed = true
                };
                await WSC.SendString(JSON.Encode(done));
            });
        }
        public static async Task ReceiveGetAreaActions(dynamic JsonMessage, WebSocketClient WSC)
        {
            var actionList = new List<string>();
            Location target = Storage.Current.Locations.Find(JsonMessage.TargetXYZ);
            var distance = target.GetDistanceFrom(Storage.Current.Locations.Find((WSC.Player as Player).CurrentXYZ));
            if (distance == 0)
            {
                actionList.Add("Explore Here");
                if (!target.IsStatic || target.OwnerID != (WSC.Player as Player).StorageID)
                {
                    actionList.Add("Take Control");
                }
            }
            else if (distance < 2)
            {
                actionList.Add("Move Here");
                if (target.OwnerID == (WSC.Player as Player).StorageID)
                {
                    actionList.Add("Change Area");
                }
                actionList.Add("Destroy");
            }
            foreach (var power in (WSC.Player as Player).Powers.FindAll(p => p.TargetList.Contains(Power.Targets.Location) && distance >= p.MinRange && distance <= p.MaxRange))
            {
                actionList.Add(power.Name);
            }
            if (actionList.Count > 0)
            {
                JsonMessage.Actions = actionList;
                await WSC.SendString(JSON.Encode(JsonMessage));
            }
        }
        public static async Task ReceiveGetAreaOccupants(dynamic JsonMessage, WebSocketClient WSC)
        {
            Location target = Storage.Current.Locations.Find(JsonMessage.TargetXYZ);
            JsonMessage.Occupants = target.Occupants;
            await WSC.SendString(JSON.Encode(JsonMessage));
        }
        #endregion Queries
    }
}
