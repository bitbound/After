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
            if (!World.Current.Locations.Exists("0,0,0"))
            {
                var strLocations = File.ReadAllText(Path.Combine(Utilities.App_Data, "Game_Data\\Base\\Locations.json"));
                foreach (var location in Json.Decode<List<Location>>(strLocations))
                {
                    World.Current.Locations.Add(location);
                }
            }
        }
        public static dynamic Clone(dynamic JsonData)
        {
            var strData = Json.Encode(JsonData);
            return Json.Decode(strData);
        }
    }
}
