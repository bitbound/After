using After.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
                player.AuthenticationTokens.Add(new AuthenticationToken() { Token = Guid.NewGuid().ToString(), LastUsed = DateTime.Now });
                Socket_Handler.SocketCollection.Add(SH);
                World.Current.Players.Add(player);
                SH.Name = username;
                JsonMessage.Result = "ok";
                JsonMessage.Password = null;
                JsonMessage.AuthenticationToken = SH.Player.AuthenticationTokens;
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
                    var authToken = new AuthenticationToken() { Token = Guid.NewGuid().ToString().Replace("-", ""), LastUsed = DateTime.Now };
                    SH.Player.AuthenticationTokens.Add(authToken);
                    SH.Player.TemporaryPassword = "";
                    SH.Player.Password = Crypto.HashPassword(JsonMessage.ConfirmNewPassword);
                    SH.Player.BadLoginAttempts = 0;
                }
            }
            else if (SH.Player.AuthenticationTokens.Count > 0 && JsonMessage.AuthenticationToken != null)
            {
                if (!SH.Player.AuthenticationTokens.Exists(at=>at.Token == JsonMessage.AuthenticationToken))
                {
                    JsonMessage.Result = "expired";
                    SH.Send(Json.Encode(JsonMessage));
                    return;
                }
                else
                {
                    SH.Player.AuthenticationTokens.RemoveAll(at => at.Token == JsonMessage.AuthenicationToken);
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
            var newToken = new AuthenticationToken() { Token = Guid.NewGuid().ToString(), LastUsed = DateTime.Now };
            SH.Player.AuthenticationTokens.Add(newToken);
            JsonMessage.AuthenticationToken = newToken.Token;
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
                WebMail.SmtpServer = "mail.after-game.net";
                WebMail.UserName = "support@after-game.net";
                WebMail.Password = "92ebf4a2-e694-4e7f-bad1-520b60615d1e";
                WebMail.From = "support@after-game.net";
                WebMail.Send(account.Email, "Password Reset for After", File.ReadAllText(HttpContext.Current.Server.MapPath("~/Docs/PasswordResetTemplate.html")).Replace("#password#", account.TemporaryPassword));
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