using After.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
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
        public static void StartUp()
        {
            if (!World.Current.Locations.Any(l => l.LocationID == "0,0,0"))
            {
                World.Current.Locations.Add(new Location()
                {
                    XCoord = 0,
                    YCoord = 0,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                World.Current.Locations.Add(new Location()
                {
                    XCoord = -2,
                    YCoord = 0,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"

                });
                World.Current.Locations.Add(new Location()
                {
                    XCoord = -1,
                    YCoord = 0,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                World.Current.Locations.Add(new Location()
                {
                    XCoord = 1,
                    YCoord = 0,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                World.Current.Locations.Add(new Location()
                {
                    XCoord = 2,
                    YCoord = 0,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                World.Current.Locations.Add(new Location()
                {
                    XCoord = -1,
                    YCoord = -1,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                World.Current.Locations.Add(new Location()
                {
                    XCoord = 1,
                    YCoord = -1,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                World.Current.Locations.Add(new Location()
                {
                    XCoord = 0,
                    YCoord = -2,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                World.Current.Locations.Add(new Location()
                {
                    XCoord = -3,
                    YCoord = 1,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                World.Current.Locations.Add(new Location()
                {
                    XCoord = -4,
                    YCoord = 2,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                World.Current.Locations.Add(new Location()
                {
                    XCoord = 3,
                    YCoord = 1,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                World.Current.Locations.Add(new Location()
                {
                    XCoord = 4,
                    YCoord = 2,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
            }
            foreach (var loc in World.Current.Locations)
            {
                if (!loc.IsStatic)
                {
                    World.Current.Locations.Remove(loc);
                }
            }
            World.Current.SaveChanges();
        }
        public static dynamic Clone(dynamic JsonData)
        {
            var strData = Json.Encode(JsonData);
            return Json.Decode(strData);
        }
        public static void SaveTheWorld()
        {
            try
            {
                World.Current.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                ex.Entries.Single().Reload();
                Task.Run(() =>
                {
                    Thread.Sleep(500);
                    SaveTheWorld();
                });
            }
            catch
            {
                World.Current = new World();
            }
        }
    }
}
