using After.Models;
using StorageLists;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;
using System.Web;
using System.Web.Helpers;
using System.Web.Script.Serialization;

/// <summary>
/// Summary description for Utilities
/// </summary>

namespace After
{
    public static class Utilities
    {
        public static string App_Data { get; set; } = HttpContext.Current.Server.MapPath("~/App_Data/");
        public static void StartUp()
        {
            if (!Storage.Current.Locations.Exists("0,0,0"))
            {
                var strLocations = File.ReadAllText(Path.Combine(Utilities.App_Data, "Game_Data\\Base\\Locations.json"));
                foreach (var location in Json.Decode<List<Location>>(strLocations))
                {
                    Storage.Current.Locations.Add(location);
                }
            }
            if (!Storage.Current.Landmarks.Exists("0,-2,0"))
            {
                var strLandmarks = File.ReadAllText(Path.Combine(Utilities.App_Data, "Game_Data\\Base\\Landmarks.json"));
                foreach (var landmark in Json.Decode<List<Landmark>>(strLandmarks))
                {
                    Storage.Current.Landmarks.Add(landmark);
                }
            }
        }
        public static dynamic Clone(dynamic JsonData)
        {
            var strData = Json.Encode(JsonData);
            return Json.Decode(strData);
        }

        public static void WriteError(Exception Ex)
        {
            var filePath = Path.Combine(HttpContext.Current.Server.MapPath("~/App_Data/Errors/"), DateTime.Now.Year.ToString(), DateTime.Now.Month.ToString().PadLeft(2, '0'), DateTime.Now.Day.ToString().PadLeft(2, '0') + ".txt");
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
                var error = Json.Encode(jsonError) + Environment.NewLine;
                File.AppendAllText(filePath, error);
                exError = exError.InnerException;
            }
        }
    }
}
