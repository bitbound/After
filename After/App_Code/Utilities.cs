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
        public static System.Timers.Timer AreaCleanupTimer { get; set; } = new System.Timers.Timer(600000);
        public static void StartUp()
        {
            using (var world = new After.Models.World())
            {
                if (!world.Locations.Any(l => l.LocationID == "0,0,0"))
                {
                    world.Locations.Add(new Location()
                    {
                        XCoord = 0,
                        YCoord = 0,
                        ZCoord = "0",
                        IsStatic = true,
                        Title = "After Commons",
                        Description = "This is the center of nothing and the start of everything.",
                        Color = "lightsteelblue"
                    });
                    world.Locations.Add(new Location()
                    {
                        XCoord = -2,
                        YCoord = 0,
                        ZCoord = "0",
                        IsStatic = true,
                        Title = "After Commons",
                        Description = "This is the center of nothing and the start of everything.",
                        Color = "lightsteelblue"

                    });
                    world.Locations.Add(new Location()
                    {
                        XCoord = -1,
                        YCoord = 0,
                        ZCoord = "0",
                        IsStatic = true,
                        Title = "After Commons",
                        Description = "This is the center of nothing and the start of everything.",
                        Color = "lightsteelblue"
                    });
                    world.Locations.Add(new Location()
                    {
                        XCoord = 1,
                        YCoord = 0,
                        ZCoord = "0",
                        IsStatic = true,
                        Title = "After Commons",
                        Description = "This is the center of nothing and the start of everything.",
                        Color = "lightsteelblue"
                    });
                    world.Locations.Add(new Location()
                    {
                        XCoord = 2,
                        YCoord = 0,
                        ZCoord = "0",
                        IsStatic = true,
                        Title = "After Commons",
                        Description = "This is the center of nothing and the start of everything.",
                        Color = "lightsteelblue"
                    });
                    world.Locations.Add(new Location()
                    {
                        XCoord = -1,
                        YCoord = -1,
                        ZCoord = "0",
                        IsStatic = true,
                        Title = "After Commons",
                        Description = "This is the center of nothing and the start of everything.",
                        Color = "lightsteelblue"
                    });
                    world.Locations.Add(new Location()
                    {
                        XCoord = 1,
                        YCoord = -1,
                        ZCoord = "0",
                        IsStatic = true,
                        Title = "After Commons",
                        Description = "This is the center of nothing and the start of everything.",
                        Color = "lightsteelblue"
                    });
                    world.Locations.Add(new Location()
                    {
                        XCoord = 0,
                        YCoord = -2,
                        ZCoord = "0",
                        IsStatic = true,
                        Title = "After Commons",
                        Description = "This is the center of nothing and the start of everything.",
                        Color = "lightsteelblue"
                    });
                    world.Locations.Add(new Location()
                    {
                        XCoord = -3,
                        YCoord = 1,
                        ZCoord = "0",
                        IsStatic = true,
                        Title = "After Commons",
                        Description = "This is the center of nothing and the start of everything.",
                        Color = "lightsteelblue"
                    });
                    world.Locations.Add(new Location()
                    {
                        XCoord = -4,
                        YCoord = 2,
                        ZCoord = "0",
                        IsStatic = true,
                        Title = "After Commons",
                        Description = "This is the center of nothing and the start of everything.",
                        Color = "lightsteelblue"
                    });
                    world.Locations.Add(new Location()
                    {
                        XCoord = 3,
                        YCoord = 1,
                        ZCoord = "0",
                        IsStatic = true,
                        Title = "After Commons",
                        Description = "This is the center of nothing and the start of everything.",
                        Color = "lightsteelblue"
                    });
                    world.Locations.Add(new Location()
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
                foreach (var loc in world.Locations)
                {
                    if (!loc.IsStatic)
                    {
                        world.Locations.Remove(loc);
                    }
                }
                world.SaveChanges();
                AreaCleanupTimer.Elapsed += AreaCleanupTimer_Elapsed;
                AreaCleanupTimer.Start();
            }
        }
        public static dynamic Clone(dynamic JsonData)
        {
            var strData = Json.Encode(JsonData);
            return Json.Decode(strData);
        }
        public static void SaveTheWorld(World Context)
        {
            try
            {
                Context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                ex.Entries.Single().Reload();
                Task.Run(() => {
                    Thread.Sleep(100);
                    SaveTheWorld(Context);
                });
            }
        }
        public static void AreaCleanupTimer_Elapsed(object sender, ElapsedEventArgs e)
        {
            using (var world = new World())
            {
                var removeList = new List<Location>();
                foreach (var loc in world.Locations)
                {
                    if (loc.IsStatic == true || loc.GetOccupants(world) != null)
                    {
                        continue;
                    }
                    if (!loc.LastVisited.HasValue || DateTime.Now - loc.LastVisited > TimeSpan.FromMinutes(1))
                    {
                        removeList.Add(loc);
                        var request = new
                        {
                            Category = "Events",
                            Type = "AreaRemoved",
                            Area = loc.ConvertToArea()
                        };
                        foreach (var player in loc.GetNearbyPlayers(world))
                        {
                            player.Send(Json.Encode(request));
                        }
                    }
                }
                if (removeList.Count > 0)
                {
                    world.Locations.RemoveRange(removeList);
                    SaveTheWorld(world);
                }
            }
        }
    }
}
