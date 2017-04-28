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
            if (World.Current.Players.FirstOrDefault((p => p.Name == name)) != null)
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
                player.AuthenticationToken = Guid.NewGuid().ToString();
                Socket_Handler.SocketCollection.Add(SH);
                World.Current.Players.Add(player);
                World.Current.SaveChanges();
                SH.CharacterID = World.Current.Players.FirstOrDefault(p => p.Name == name).CharacterID;
                jsonMessage.Result = "ok";
                jsonMessage.Password = null;
                jsonMessage.AuthenticationToken = SH.Player.AuthenticationToken;
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
            SH.CharacterID = World.Current.Players.FirstOrDefault(p => p.Name == playerName).CharacterID;
            if (SH.Player == null)
            {
                jsonMessage.Result = "failed";
                SH.Send(Json.Encode(jsonMessage));
                return;
            }
            else if (SH.Player.AuthenticationToken != null && jsonMessage.AuthenticationToken != null)
            {
                if (SH.Player.AuthenticationToken != jsonMessage.AuthenticationToken)
                {
                    jsonMessage.Result = "expired";
                    SH.Send(Json.Encode(jsonMessage));
                    return;
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
            if (SH.Player.CurrentXYZ == null)
            {
                SH.Player.CurrentXYZ = "0,0,0";
            }
            SH.Authenticated = true;
            SH.Player.IsCharging = false;
            SH.Player.CurrentCharge = 0;
            SH.Player.MovementState = Character.MovementStates.Ready;
            Socket_Handler.SocketCollection.Add(SH);
            jsonMessage.Result = "ok";
            SH.Player.AuthenticationToken = Guid.NewGuid().ToString();
            jsonMessage.AuthenticationToken = SH.Player.AuthenticationToken;
            SH.Send(Json.Encode(jsonMessage));
            Socket_Handler.SocketCollection.Broadcast(Json.Encode(new
            {
                Category = "Accounts",
                Type = "Connected",
                Username = SH.Player.Name
            }));
            var location = SH.Player.GetCurrentLocation();
            if (location == null)
            {
                SH.Player.CurrentXYZ = "0,0,0";
            }
            SH.Player.GetCurrentLocation().CharacterArrives(SH.Player);
        }
    }
}