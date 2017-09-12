using After.Models;
using Dynamic_JSON;
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
    }
}
