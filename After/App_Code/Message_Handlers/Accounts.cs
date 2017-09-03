using After.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Helpers;

namespace After.Message_Handlers
{
    public static class Accounts
    {
        public static void HandleAccountCreation(dynamic JsonMessage, Socket_Handler SH)
        {
            string username = JsonMessage.Username.Trim();
            if (World.Current.Players.Exists(username))
            {
                JsonMessage.Result = "exists";
                JsonMessage.Password = null;
                SH.Send(Json.Encode(JsonMessage));
                return;
            }
            else
            {
                SH.Authenticated = true;
                var player = new Player()
                {
                    Name = username,
                    Email = JsonMessage.Email,
                    Color = JsonMessage.Color,
                    Password = Crypto.HashPassword(JsonMessage.Password),
                    // TODO: Add void area interaction.
                    CurrentXYZ = "0,0,0",
                    MovementState = Character.MovementStates.Ready
                };
                player.AuthenticationTokens.Add(Guid.NewGuid().ToString());
                Socket_Handler.SocketCollection.Add(SH);
                World.Current.Players.Add(player);
                SH.Name = username;
                JsonMessage.Result = "ok";
                JsonMessage.Password = null;
                JsonMessage.AuthenticationToken = SH.Player.AuthenticationTokens.Last();
                SH.Send(Json.Encode(JsonMessage));
                Socket_Handler.SocketCollection.Broadcast(Json.Encode(new
                {
                    Category = "Accounts",
                    Type = "Connected",
                    Username = SH.Player.Name
                }));
                SH.Player.GetCurrentLocation().CharacterArrives(SH.Player);
            }
        }
        public static void HandleLogon(dynamic JsonMessage, Socket_Handler SH)
        {
            var username = (string)JsonMessage.Username.Trim();
            SH.Name = username;
            if (!World.Current.Players.Exists(SH.Name))
            {
                JsonMessage.Result = "failed";
                SH.Send(Json.Encode(JsonMessage));
                return;
            }
            while (SH.Player.AuthenticationTokens.Count > 10)
            {
                SH.Player.AuthenticationTokens.RemoveAt(0);
            }
            if (SH.Player.BadLoginAttempts >= 3)
            {
                if (DateTime.Now - SH.Player.LastBadLogin > TimeSpan.FromMinutes(10))
                {
                    SH.Player.BadLoginAttempts = 0;
                }
                else
                {
                    JsonMessage.Result = "locked";
                    SH.Send(Json.Encode(JsonMessage));
                    return;
                }
            }
            if (JsonMessage.Password == SH.Player.TemporaryPassword)
            {
                if (String.IsNullOrEmpty(JsonMessage.NewPassword))
                {
                    JsonMessage.Result = "new required";
                    SH.Send(Json.Encode(JsonMessage));
                    return;
                }
                else if (JsonMessage.NewPassword != JsonMessage.ConfirmNewPassword)
                {
                    JsonMessage.Result = "password mismatch";
                    SH.Send(Json.Encode(JsonMessage));
                    return;
                }
                else
                {
                    var authToken = Guid.NewGuid().ToString();
                    SH.Player.AuthenticationTokens.Add(authToken);
                    SH.Player.TemporaryPassword = "";
                    SH.Player.Password = Crypto.HashPassword(JsonMessage.ConfirmNewPassword);
                    SH.Player.BadLoginAttempts = 0;
                }
            }
            else if (SH.Player.AuthenticationTokens.Count > 0 && JsonMessage.AuthenticationToken != null)
            {
                if (!SH.Player.AuthenticationTokens.Contains(JsonMessage.AuthenticationToken))
                {
                    JsonMessage.Result = "expired";
                    SH.Send(Json.Encode(JsonMessage));
                    return;
                }
                else
                {
                    SH.Player.AuthenticationTokens.Remove(JsonMessage.AuthenicationToken);
                }
            }
            else if (!Crypto.VerifyHashedPassword(SH.Player.Password, JsonMessage.Password))
            {
                SH.Player.BadLoginAttempts++;
                SH.Player.LastBadLogin = DateTime.Now;
                JsonMessage.Result = "failed";
                SH.Send(Json.Encode(JsonMessage));
                return;
            }
            if (Socket_Handler.SocketCollection.Any(s=>(s as Socket_Handler)?.Player.Name.ToLower() == username.ToLower()))
            {
                var existing = Socket_Handler.SocketCollection.Where(s => (s as Socket_Handler)?.Player.Name.ToLower() == username.ToLower()).ToList();
                var message = new
                {
                    Category = "Accounts",
                    Type = "LoginElsewhere"
                };
                for (int i = existing.Count - 1; i >= 0; i--)
                {
                    Socket_Handler.SocketCollection.Remove(existing[i]);
                    existing[i].Send(Json.Encode(message));
                    existing[i].Close();
                    JsonMessage.Note = "LoginElsewhere";
                }
            }
            SH.Player.BadLoginAttempts = 0;
            SH.Authenticated = true;
            SH.Player.IsCharging = false;
            SH.Player.CurrentCharge = 0;
            SH.Player.MovementState = Character.MovementStates.Ready;
            Socket_Handler.SocketCollection.Add(SH);
            JsonMessage.Result = "ok";
            var newToken = Guid.NewGuid().ToString();
            SH.Player.AuthenticationTokens.Add(newToken);
            JsonMessage.AuthenticationToken = newToken;
            SH.Send(Json.Encode(JsonMessage));
            Socket_Handler.SocketCollection.Broadcast(Json.Encode(new
            {
                Category = "Accounts",
                Type = "Connected",
                Username = SH.Player.Name
            }));
        }
        public static void HandleChangeSetting(dynamic JsonMessage, Socket_Handler SH)
        {
            string prop = JsonMessage.Property;
            SH.Player.Settings.GetType().GetProperty(prop).SetValue(SH.Player.Settings, JsonMessage.Value);
        }
        public static void HandleForgotPassword(dynamic JsonMessage, Socket_Handler SH)
        {
            try
            {
                var username = JsonMessage.Username;
                if (string.IsNullOrWhiteSpace(username))
                {
                    JsonMessage.Result = "empty";
                    SH.Send(Json.Encode(JsonMessage));
                    return;
                }
                if (!World.Current.Players.Exists(username))
                {
                    JsonMessage.Result = "unknown";
                    SH.Send(Json.Encode(JsonMessage));
                    return;
                }
                Player account = World.Current.Players.Find(username);
                if (string.IsNullOrWhiteSpace(account.Email))
                {
                    JsonMessage.Result = "no email";
                    SH.Send(Json.Encode(JsonMessage));
                    return;
                }
                account.TemporaryPassword = Path.GetRandomFileName().Replace(".", "");
                JsonMessage.Result = "ok";
                JsonMessage.TemporaryPassword = account.TemporaryPassword;
                var request = new
                {
                    Email = account.Email,
                    Subject = "Password Reset for After",
                    Message = File.ReadAllText(HttpContext.Current.Server.MapPath("~/Docs/PasswordResetTemplate.html")).Replace("#password#", account.TemporaryPassword)
                };
                var wr = WebRequest.CreateHttp("https://invis.me/Services/SendEmail");
                wr.Method = "POST";
                using (var rs = wr.GetRequestStream())
                {
                    using (var sw = new StreamWriter(rs))
                    {
                        sw.Write(Json.Encode(request));
                    }
                }
                wr.GetResponse();
                SH.Send(Json.Encode(JsonMessage));
            }
            catch (Exception ex)
            {
                After.Utilities.WriteError(ex);
                JsonMessage.Result = "failed";
                SH.Send(Json.Encode(JsonMessage));
            }
        }
    }
}