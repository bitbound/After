using After.Models;
using Really_Dynamic;
using System;
using System.Collections.Generic;
using System.IO;
using Translucency.WebSockets;

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
            if (!Storage.Current.Locations.Exists("0,0,0"))
            {
                var strLocations = File.ReadAllText(Path.Combine(App.DataPath, "Game_Data\\Base\\Locations.json"));
                foreach (var location in JSON.Decode<List<Location>>(strLocations))
                {
                    Storage.Current.Locations.Add(location);
                }
            }
            if (!Storage.Current.Landmarks.Exists("0,-2,0"))
            {
                var strLandmarks = File.ReadAllText(Path.Combine(App.DataPath, "Game_Data\\Base\\Landmarks.json"));
                foreach (var landmark in JSON.Decode<List<Landmark>>(strLandmarks))
                {
                    Storage.Current.Landmarks.Add(landmark);
                }
            }
            Storage.Current.Locations.GetAll().ForEach(loc => {
                foreach (var occupant in loc.Occupants) { 
                    if (Storage.Current.NPCs.Find(occupant.StorageID) == null)
                    {
                        Storage.Current.Locations.Find(loc.StorageID).Occupants.Remove(occupant);
                    }
                }
            });
            Storage.Current.NPCs.GetAll().ForEach(npc =>
            {
                var loc = Storage.Current.Locations.Find(npc.CurrentXYZ);
                if (!loc?.Occupants.Exists(oc=>oc.StorageID == npc.StorageID) == true)
                {
                    loc.Occupants.Add(new Models.Occupant() { DisplayName = npc.DisplayName, StorageID = npc.StorageID });
                }
            });
        }
 
    }
}
