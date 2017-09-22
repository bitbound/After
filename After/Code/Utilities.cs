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
    public static class Utilities
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
                var strLocations = File.ReadAllText(Path.Combine(Utilities.DataPath, "Game_Data\\Base\\Locations.json"));
                foreach (var location in JSON.Decode<List<Location>>(strLocations))
                {
                    Storage.Current.Locations.Add(location);
                }
            }
            if (!Storage.Current.Landmarks.Exists("0,-2,0"))
            {
                var strLandmarks = File.ReadAllText(Path.Combine(Utilities.DataPath, "Game_Data\\Base\\Landmarks.json"));
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
                if (!loc.Occupants.Exists(oc=>oc.StorageID == npc.StorageID))
                {
                    loc.Occupants.Add(new Models.Occupant() { DisplayName = npc.DisplayName, StorageID = npc.StorageID });
                }
            });
        }
        public static void WriteError(Exception Ex)
        {
            var filePath = Path.Combine(DataPath, "Errors", DateTime.Now.Year.ToString(), DateTime.Now.Month.ToString().PadLeft(2, '0'), DateTime.Now.Day.ToString().PadLeft(2, '0') + ".txt");
            if (!Directory.Exists(Path.GetDirectoryName(filePath)))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));
            }
            var exError = Ex;
            while (exError != null)
            {
                var jsonError = new
                {
                    Timestamp = DateTime.Now.ToString(),
                    Message = exError?.Message,
                    InnerEx = exError?.InnerException?.Message,
                    Source = exError?.Source,
                    StackTrace = exError?.StackTrace,
                };
                var error = JSON.Encode(jsonError) + Environment.NewLine;
                File.AppendAllText(filePath, error);
                exError = exError.InnerException;
            }
        }
        public static void WriteLog(string Category, string Message)
        {
            var filePath = Path.Combine(DataPath, "Logs", DateTime.Now.Year.ToString(), DateTime.Now.Month.ToString().PadLeft(2, '0'), DateTime.Now.Day.ToString().PadLeft(2, '0') + ".txt");
            if (!Directory.Exists(Path.GetDirectoryName(filePath)))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));
            }
            File.AppendAllText(filePath, $"{Category.ToUpper()} - {DateTime.Now.ToString()} - {Message}");
        }
    }
}
