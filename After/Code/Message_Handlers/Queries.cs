using After.Models;
using Dynamic_JSON;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Translucency.WebSockets;

namespace After.Message_Handlers
{
    public static class Queries
    {
        public static async Task HandlePlayerUpdate(dynamic JsonMessage, WebSocketClient WSC)
        {
            JsonMessage.Player = (WSC.Player as Player).ConvertToMe();
            await WSC.SendString(JSON.Encode(JsonMessage));
        }
        public static async Task HandleRefreshView(dynamic JsonMessage, WebSocketClient WSC)
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

        public static async Task HandleGetPowers(dynamic JsonMessage, WebSocketClient WSC)
        {
            JsonMessage.Powers = (WSC.Player as Player).Powers;
            await WSC.SendString(JSON.Encode(JsonMessage));
        }
        public static async Task HandleFirstLoad(dynamic JsonMessage, WebSocketClient WSC)
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
        public static async Task HandleMapUpdate(dynamic JsonMessage, WebSocketClient WSC)
        {
            await Task.Run(async ()=>{
                var visibleLocations = (WSC.Player as Player).GetVisibleLocations();
                for (var x = JsonMessage.XMin; x <= JsonMessage.XMax; x++)
                {
                    for (var y = JsonMessage.YMin; y <= JsonMessage.YMax; y++)
                    {
                        var location = Storage.Current.Locations.Find($"{x},{y},{(WSC.Player as Player).ZCoord}");
                        var landmark = Storage.Current.Landmarks.Find($"{x},{y},{(WSC.Player as Player).ZCoord}");
                        if (location != null)
                        {
                            if (location.IsStatic == false && DateTime.Now - location.LastVisited > TimeSpan.FromMinutes(1))
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
                        if (landmark != null)
                        {
                            var request = new
                            {
                                Category = "Queries",
                                Type = "MapUpdate",
                                Landmark = landmark.ConvertToDynamic()
                            };
                            await WSC.SendString(JSON.Encode(request));
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
        public static async Task HandleGetAreaActions(dynamic JsonMessage, WebSocketClient WSC)
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
            foreach (var power in (WSC.Player as Player).Powers.FindAll(p=> p.TargetList.Contains(Power.Targets.Location) && distance >= p.MinRange && distance <= p.MaxRange))
            {
                actionList.Add(power.Name);
            }
            if (actionList.Count > 0)
            {
                JsonMessage.Actions = actionList;
                await WSC.SendString(JSON.Encode(JsonMessage));
            }
        }
        public static async Task HandleGetAreaOccupants(dynamic JsonMessage, WebSocketClient WSC)
        {
            Location target = Storage.Current.Locations.Find(JsonMessage.TargetXYZ);
            JsonMessage.Occupants = target.Occupants;
            await WSC.SendString(JSON.Encode(JsonMessage));
        }
    }
}