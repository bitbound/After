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
        public static void HandleAccountCreation(dynamic jsonMessage, Socket_Handler SH)
        {
            string name = jsonMessage.Username;
            if (World.Current.Players.Exists(name))
            {
                jsonMessage.Result = "exists";
                jsonMessage.Password = null;
                SH.Send(Json.Encode(jsonMessage));
                return;
            }
            else
            {
                SH.Authenticated = true;
                var player = new Player()
                {
                    Name = name,
                    Color = jsonMessage.Color,
                    Password = Crypto.HashPassword(jsonMessage.Password),
                    // TODO: Add void area interaction.
                    CurrentXYZ = "0,0,0",
                    MovementState = Character.MovementStates.Ready
                };
                player.AuthenticationTokens.Add(new AuthenticationToken() { Token = Guid.NewGuid().ToString(), LastUsed = DateTime.Now });
                Socket_Handler.SocketCollection.Add(SH);
                World.Current.Players.Add(player);
                SH.Name = name;
                jsonMessage.Result = "ok";
                jsonMessage.Password = null;
                jsonMessage.AuthenticationToken = SH.Player.AuthenticationTokens;
                SH.Send(Json.Encode(jsonMessage));
                Socket_Handler.SocketCollection.Broadcast(Json.Encode(new
                {
                    Category = "Accounts",
                    Type = "Connected",
                    Username = SH.Player.Name
                }));
                SH.Player.GetCurrentLocation().CharacterArrives(SH.Player);
            }
        }
        public static void HandleLogon(dynamic jsonMessage, Socket_Handler SH)
        {
            var playerName = (string)jsonMessage.Username;
            SH.Name = playerName;
            if (!World.Current.Players.Exists(SH.Name))
            {
                jsonMessage.Result = "failed";
                SH.Send(Json.Encode(jsonMessage));
                return;
            }
            while (SH.Player.AuthenticationTokens.Count > 10)
            {
                SH.Player.AuthenticationTokens.RemoveAt(0);
            }
            if (SH.Player.AuthenticationTokens.Count > 0 && jsonMessage.AuthenticationToken != null)
            {
                if (!SH.Player.AuthenticationTokens.Exists(at=>at.Token == jsonMessage.AuthenticationToken))
                {
                    jsonMessage.Result = "expired";
                    SH.Send(Json.Encode(jsonMessage));
                    return;
                }
                else
                {
                    SH.Player.AuthenticationTokens.RemoveAll(at => at.Token == jsonMessage.AuthenicationToken);
                }
            }
            else if (!Crypto.VerifyHashedPassword(SH.Player.Password, jsonMessage.Password))
            {
                jsonMessage.Result = "failed";
                SH.Send(Json.Encode(jsonMessage));
                return;
            }
            if (Socket_Handler.SocketCollection.Any(s=>(s as Socket_Handler)?.Player.Name.ToLower() == playerName.ToLower()))
            {
                var existing = Socket_Handler.SocketCollection.FirstOrDefault(s => (s as Socket_Handler)?.Player.Name.ToLower() == playerName.ToLower());
                var message = new
                {
                    Category = "Accounts",
                    Type = "LoginElsewhere"
                };
                existing.Send(Json.Encode(message));
                existing.Close();
                jsonMessage.Note = "LoginElsewhere";
            }

            SH.Authenticated = true;
            SH.Player.IsCharging = false;
            SH.Player.CurrentCharge = 0;
            SH.Player.MovementState = Character.MovementStates.Ready;
            Socket_Handler.SocketCollection.Add(SH);
            jsonMessage.Result = "ok";
            var newToken = new AuthenticationToken() { Token = Guid.NewGuid().ToString(), LastUsed = DateTime.Now };
            SH.Player.AuthenticationTokens.Add(newToken);
            jsonMessage.AuthenticationToken = newToken.Token;
            SH.Send(Json.Encode(jsonMessage));
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
    }
}