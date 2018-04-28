using After.Models;
using After.Dependencies;
using System;
using System.Collections.Generic;
using System.IO;
using After.Dependencies.WebSockets;

/// <summary>
/// Summary description for Utilities
/// </summary>

namespace After
{
    public static class App
    {
        public static string RootPath { get; set; }
        public static string DataPath
        {
            get
            {
                return Path.Combine(RootPath, "Data");
            }
        }
        public static WebSocketServer Server
        {
            get
            {
                return WebSocketServer.ServerList["After"];
            }
        }
       
        public static void StartUp()
        {
            if (!Storage.Locations.Exists("0,0,0"))
            {
                var strLocations = File.ReadAllText(Path.Combine(App.DataPath, "Game_Data\\Base\\Locations.json"));
                foreach (var location in JSON.Decode<List<Location>>(strLocations))
                {
                    Storage.Locations.Add(location);
                }
            }
            Storage.Locations.GetAll().ForEach(loc => {
                foreach (var occupant in loc.Occupants) { 
                    if (Storage.NPCs.Find(occupant.StorageID) == null)
                    {
                        Storage.Locations.Find(loc.StorageID).Occupants.Remove(occupant);
                    }
                }
            });
            Storage.NPCs.GetAll().ForEach(npc =>
            {
                var loc = Storage.Locations.Find(npc.CurrentLocation);
                if (!loc?.Occupants.Exists(oc=>oc.StorageID == npc.StorageID) == true)
                {
                    loc.Occupants.Add(new Models.Occupant() { DisplayName = npc.DisplayName, StorageID = npc.StorageID });
                }
            });
        }
 
    }
}
