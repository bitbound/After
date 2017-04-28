using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Web.Helpers;

namespace After.Models
{
    public class World : DbContext
    {
        public static World Current { get; set; } = new World();
        public World()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<World, After.Migrations.Configuration>());
        }

        public DbSet<Location> Locations { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<NPC> NPCs { get; set; }
        public DbSet<Hostile> Hostiles { get; set; }
        public DbSet<Character> Characters { get; set; }
        public DbSet<Message> Messages { get; set; }

        public Location CreateTempLocation(string[] XYZ)
        {
            var location = new Location();
            location.XCoord = double.Parse(XYZ[0]);
            location.YCoord = double.Parse(XYZ[1]);
            location.ZCoord = XYZ[2];
            location.Color = "black";
            location.Description = "A completely empty area.";
            location.Title = "Empty Area";
            Locations.Add(location);
            return location;
        }
    }
}
