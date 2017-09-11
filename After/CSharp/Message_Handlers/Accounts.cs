using After.Models;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using Translucency.WebSockets;
using System.Linq;
using System.Threading;

namespace After.Message_Handlers
{
    public static class Accounts
    {
        public static void HandleAccountCreation(dynamic JsonMessage, WebSocketClient WSC)
        {
            string username = JsonMessage.Username.Trim();
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
                    Email = JsonMessage.Email,
                    Color = JsonMessage.Color,
                    // TODO: Add void area interaction.
                    CurrentXYZ = "0,0,0",
                    MovementState = Character.MovementStates.Ready
                };
                var hasher = new PasswordHasher<Player>();
                player.Password = hasher.HashPassword(player, JsonMessage.Password.ToString());

                WSC.Tags["Authenticated"] = true;
                WSC.Tags["Player"] = player;
                player.AuthenticationTokens.Add(Guid.NewGuid().ToString());
                // TODO: Remove? Socket_Handler.SocketCollection.Add(WSC);
                Storage.Current.Players.Add(player);
                // TODO: Remove? WSC.Name = username;
                JsonMessage.Result = "ok";
                JsonMessage.Password = null;
                JsonMessage.AuthenticationToken = player.AuthenticationTokens.Last();
                WSC.SendJSON(JsonMessage);
                Utilities.Server.Broadcast(JsonConvert.SerializeObject(new
                {
                    Category = "Accounts",
                    Type = "Connected",
                    Username = player.Name
                }), WSC);
                player.GetCurrentLocation().CharacterArrives(player);
            }
        }
        public static void HandleLogon(dynamic JsonMessage, WebSocketClient WSC)
        {
            var username = (string)JsonMessage.Username.Trim();
            if (!Storage.Current.Players.Exists(username))
            {
                JsonMessage.Result = "failed";
                WSC.SendString(JsonConvert.SerializeObject(JsonMessage));
                return;
            }
            var player = Storage.Current.Players.Find("username");
            var hasher = new PasswordHasher<Player>();
            var clientList = WebSocketServer.ServerList["After"].ClientList;
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
                    WSC.SendString(JsonConvert.SerializeObject(JsonMessage));
                    return;
                }
            }
            if (JsonMessage.Password == player.TemporaryPassword)
            {
                if (String.IsNullOrEmpty(JsonMessage.NewPassword))
                {
                    JsonMessage.Result = "new required";
                    WSC.SendString(JsonConvert.SerializeObject(JsonMessage));
                    return;
                }
                else if (JsonMessage.NewPassword != JsonMessage.ConfirmNewPassword)
                {
                    JsonMessage.Result = "password mismatch";
                    WSC.SendString(JsonConvert.SerializeObject(JsonMessage));
                    return;
                }
                else
                {
                    var authToken = Guid.NewGuid().ToString();
                    player.AuthenticationTokens.Add(authToken);
                    player.TemporaryPassword = "";
                    player.BadLoginAttempts = 0;
                    player.Password = hasher.HashPassword(WSC.Tags["Player"] as Player, JsonMessage["ConfirmNewPassword"].ToString());
                }
            }
            else if (player.AuthenticationTokens.Count > 0 && JsonMessage.AuthenticationToken != null)
            {
                if (!player.AuthenticationTokens.Contains(JsonMessage.AuthenticationToken))
                {
                    JsonMessage.Result = "expired";
                    WSC.SendString(JsonConvert.SerializeObject(JsonMessage));
                    return;
                }
                else
                {
                    player.AuthenticationTokens.Remove(JsonMessage.AuthenicationToken);
                }
            }
            else if (!hasher.VerifyHashedPassword(player, player.Password, JsonMessage.Password))
            {
                player.BadLoginAttempts++;
                player.LastBadLogin = DateTime.Now;
                JsonMessage.Result = "failed";
                WSC.SendString(JsonConvert.SerializeObject(JsonMessage));
                return;
            }
            if (clientList.Exists(s=>(s as WebSocketClient).Tags?["Player"]?.Name.ToLower() == username.ToLower()))
            {
                var existing = clientList.FindAll(s => (s as WebSocketClient).Tags?["Player"]?.Name.ToLower() == username.ToLower());
                var message = new
                {
                    Category = "Accounts",
                    Type = "LoginElsewhere"
                };
                for (int i = existing.Count - 1; i >= 0; i--)
                {
                    clientList.Remove(existing[i]);
                    existing[i].SendString(JsonConvert.SerializeObject(message));
                    existing[i].ClientSocket.CloseAsync(System.Net.WebSockets.WebSocketCloseStatus.NormalClosure, "Login elsewhere.", CancellationToken.None);
                }
            }
            player.BadLoginAttempts = 0;
            WSC.Tags["Player"] = player;
            WSC.Tags["Authenticated"] = true;
            player.IsCharging = false;
            player.CurrentCharge = 0;
            player.MovementState = Character.MovementStates.Ready;
            JsonMessage.Result = "ok";
            var newToken = Guid.NewGuid().ToString();
            player.AuthenticationTokens.Add(newToken);
            JsonMessage.AuthenticationToken = newToken;
            WSC.SendString(JsonConvert.SerializeObject(JsonMessage));
            Utilities.Server.Broadcast(JsonConvert.SerializeObject(new
            {
                Category = "Accounts",
                Type = "Connected",
                Username = (WSC.Tags["Player"] as Player).Name
            }), WSC);
        }
        public static void HandleChangeSetting(dynamic JsonMessage, WebSocketClient WSC)
        {
            string prop = JsonMessage.Property;
            (WSC.Tags["Player"] as Player).Settings.GetType().GetProperty(prop).SetValue((WSC.Tags["Player"] as Player).Settings, JsonMessage.Value);
        }
        public static void HandleForgotPassword(dynamic JsonMessage, WebSocketClient WSC)
        {
            try
            {
                var username = JsonMessage.Username;
                if (string.IsNullOrWhiteSpace(username))
                {
                    JsonMessage.Result = "empty";
                    WSC.SendString(JsonConvert.SerializeObject(JsonMessage));
                    return;
                }
                if (!Storage.Current.Players.Exists(username))
                {
                    JsonMessage.Result = "unknown";
                    WSC.SendString(JsonConvert.SerializeObject(JsonMessage));
                    return;
                }
                Player account = Storage.Current.Players.Find(username);
                if (string.IsNullOrWhiteSpace(account.Email))
                {
                    JsonMessage.Result = "no email";
                    WSC.SendString(JsonConvert.SerializeObject(JsonMessage));
                    return;
                }
                account.TemporaryPassword = Path.GetRandomFileName().Replace(".", "");
                JsonMessage.Result = "ok";
                JsonMessage.TemporaryPassword = account.TemporaryPassword;
                var request = new
                {
                    Email = account.Email,
                    Subject = "Password Reset for After",
                    Message = File.ReadAllText(Path.Combine(Utilities.RootPath, "/Docs/PasswordResetTemplate.html")).Replace("#password#", account.TemporaryPassword)
                };
                var wr = WebRequest.CreateHttp("https://invis.me/Services/SendEmail");
                wr.Method = "POST";
                using (var rs = wr.GetRequestStream())
                {
                    using (var sw = new StreamWriter(rs))
                    {
                        sw.Write(JsonConvert.SerializeObject(request));
                    }
                }
                wr.GetResponse();
                WSC.SendString(JsonConvert.SerializeObject(JsonMessage));
            }
            catch (Exception ex)
            {
                After.Utilities.WriteError(ex);
                JsonMessage.Result = "failed";
                WSC.SendString(JsonConvert.SerializeObject(JsonMessage));
            }
        }
    }
}