using After.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.IO;
using System.Linq;
using System.Net;
using Translucency.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using After.Scripting;
using Really_Dynamic;
using System.Collections.Generic;

namespace After.Message_Handlers
{
    public static class Accounts
    {
        public static async Task HandleAccountCreation(dynamic JsonMessage, WebSocketClient WSC)
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
                var landMark = new Landmark()
                {
                    Color = player.Color,
                    StorageID = player.CurrentXYZ,
                    FontSize = 100,
                    Text = $"{username}'s Inner Void"
                };
                Storage.Current.Landmarks.Add(landMark);
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
                    TriggerSources = new List<Type>() { typeof(Player) }
                    
                });
                Storage.Current.NPCs.Add(norahc);
                innerVoid.Occupants.Add(new Models.Occupant() { DisplayName = norahc.DisplayName, StorageID = norahc.StorageID });

                var hasher = new PasswordHasher<Player>();
                player.Password = hasher.HashPassword(player, JsonMessage.Password.ToString());
                WSC.Authenticated = true;
                WSC.Player = player;
                player.AuthenticationTokens.Add(Guid.NewGuid().ToString());
                Storage.Current.Players.Add(player);
                JsonMessage.Result = "ok";
                JsonMessage.Password = null;
                JsonMessage.AuthenticationToken = player.AuthenticationTokens.Last();
                WSC.SendJSON(JsonMessage);
                await Utilities.Server.Broadcast(JSON.Encode(new
                {
                    Category = "Accounts",
                    Type = "Connected",
                    Username = player.Name
                }));
                Utilities.Server.ClientList.Add(WSC);
            }
        }
        public static async Task HandleLogon(dynamic JsonMessage, WebSocketClient WSC)
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
            if (clientList.Exists(s=>(s as WebSocketClient)?.Player?.Name.ToLower() == username.ToLower()))
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
            WSC.Player= player;
            WSC.Authenticated = true;
            player.IsCharging = false;
            player.CurrentCharge = 0;
            player.MovementState = Character.MovementStates.Ready;
            JsonMessage.Result = "ok";
            var newToken = Guid.NewGuid().ToString();
            player.AuthenticationTokens.Add(newToken);
            JsonMessage.AuthenticationToken = newToken;
            WSC.SendString(JSON.Encode(JsonMessage));
            await Utilities.Server.Broadcast(JSON.Encode(new
            {
                Category = "Accounts",
                Type = "Connected",
                Username = (WSC.Player as Player).Name
            }));
            Utilities.Server.ClientList.Add(WSC);
        }
        public static void HandleChangeSetting(dynamic JsonMessage, WebSocketClient WSC)
        {
            string prop = JsonMessage.Property;
            (WSC.Player as Player).Settings.GetType().GetProperty(prop).SetValue((WSC.Player as Player).Settings, JsonMessage.Value);
        }
        public static async Task HandleForgotPassword(dynamic JsonMessage, WebSocketClient WSC)
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
                    Message = File.ReadAllText(Path.Combine(Utilities.RootPath, "Docs\\PasswordResetTemplate.html")).Replace("#password#", account.TemporaryPassword)
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
                After.Utilities.WriteError(ex);
                JsonMessage.Result = "failed";
                await WSC.SendString(JSON.Encode(JsonMessage));
            }
        }
    }
}