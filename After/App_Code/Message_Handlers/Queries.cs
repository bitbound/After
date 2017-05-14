using After.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;

namespace After.Message_Handlers
{
    public static class Queries
    {
        public static void HandlePlayerUpdate(dynamic JsonMessage, Socket_Handler SH)
        {
            JsonMessage.Player = SH.Player.ConvertToMe();
            SH.Send(Json.Encode(JsonMessage));
        }
        public static void HandleRefreshView(dynamic JsonMessage, Socket_Handler SH)
        {
            var souls = new List<dynamic>();
            var areas = new List<dynamic>();
            var location = SH.Player.GetCurrentLocation();
            if (location == null)
            {
                return;
            }
            foreach (var area in SH.Player.GetVisibleLocations())
            {
                if (area.IsStatic == false && DateTime.Now - area.LastVisited > TimeSpan.FromMinutes(1))
                {
                    var request = new
                    {
                        Category = "Events",
                        Type = "AreaRemoved",
                        Area = area.ConvertToArea(true)
                    };
                    foreach (var player in area.GetNearbyPlayers())
                    {
                        player.Send(Json.Encode(request));
                    }
                    World.Current.Locations.Remove(area.StorageID);
                    continue;
                }
                foreach (var occupant in area.Occupants)
                {
                    Character character = World.Current.NPCs.Find(occupant);
                    if (character == null)
                    {
                        character = World.Current.Players.Find(occupant);
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
            SH.Send(Json.Encode(JsonMessage));
        }

        public static void HandleGetPowers(dynamic JsonMessage, Socket_Handler SH)
        {
            JsonMessage.Powers = SH.Player.Powers;
            SH.Send(Json.Encode(JsonMessage));
        }
        public static void HandleFirstLoad(dynamic JsonMessage, Socket_Handler SH)
        {
            if (String.IsNullOrWhiteSpace(SH.Player.CurrentXYZ))
            {
                if (String.IsNullOrWhiteSpace(SH.Player.PreviousXYZ))
                {
                    SH.Player.CurrentXYZ = "0,0,0";
                }
                else
                {
                    SH.Player.CurrentXYZ = SH.Player.PreviousXYZ;
                }
            }
            if (!World.Current.Locations.Exists(SH.Player.CurrentXYZ))
            {
                SH.Player.CurrentXYZ = "0,0,0";
            }
            JsonMessage.Settings = SH.Player.Settings;
            JsonMessage.Player = SH.Player.ConvertToMe();
            JsonMessage.Powers = SH.Player.Powers;
            JsonMessage.AccountType = SH.Player.AccountType;
            SH.Send(Json.Encode(JsonMessage));

            SH.Player.GetCurrentLocation().CharacterArrives(SH.Player);
        }
        public static void HandleMapUpdate(dynamic JsonMessage, Socket_Handler SH)
        {
            var visibleLocations = SH.Player.GetVisibleLocations();
            for (var x = JsonMessage.XMin; x <= JsonMessage.XMax; x++)
            {
                for (var y = JsonMessage.YMin; y <= JsonMessage.YMax; y++)
                {
                    var location = World.Current.Locations.Find($"{x},{y},{SH.Player.ZCoord}");
                    var landmark = World.Current.Landmarks.Find($"{x},{y},{SH.Player.ZCoord}");
                    if (location != null)
                    {
                        if (!visibleLocations.Contains(location))
                        {
                            var request = new
                            {
                                Category = "Queries",
                                Type = "MapUpdate",
                                Area = location.ConvertToArea(false)
                            };
                            SH.Send(Json.Encode(request));
                        }
                    }
                    if (landmark != null)
                    {
                        var request = new
                        {
                            Category = "Queries",
                            Type = "MapUpdate",
                            Landmark = landmark.ConvertToDynamic()
                        };
                        SH.Send(Json.Encode(request));
                    }
                }
            }
            var done = new
            {
                Category = "Queries",
                Type = "MapUpdate",
                Completed = true
            };
            SH.Send(Json.Encode(done));
        }
        public static void HandleGetAreaActions(dynamic JsonMessage, Socket_Handler SH)
        {
            var actionList = new List<string>();
            Location target = World.Current.Locations.Find(JsonMessage.TargetXYZ);
            var distance = target.GetDistanceFrom(World.Current.Locations.Find(SH.Player.CurrentXYZ));
            if (distance == 0)
            {
                actionList.Add("Explore Here");
                if (!target.IsStatic || target.OwnerID != SH.Player.StorageID)
                {
                    actionList.Add("Take Control");
                }
            }
            else if (distance < 2)
            {
                actionList.Add("Move Here");
                if (target.OwnerID == SH.Player.StorageID)
                {
                    actionList.Add("Change Area");
                }
                actionList.Add("Uncreate");
            }
            foreach (var power in SH.Player.Powers.FindAll(p=> p.TargetList.Contains(Power.Targets.Location) && distance >= p.MinRange && distance <= p.MaxRange))
            {
                actionList.Add(power.Name);
            }
            if (actionList.Count > 0)
            {
                JsonMessage.Actions = actionList;
                SH.Send(Json.Encode(JsonMessage));
            }
        }
    }
}