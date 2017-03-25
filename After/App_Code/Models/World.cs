using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Data.Entity;

namespace After.Models
{
    public class World : DbContext
    {
        public static World Current { get; set; } = new World();
        public System.Timers.Timer SaveTimer { get; set; }
        public World()
        {
            SaveTimer = new System.Timers.Timer(60000);
            SaveTimer.Elapsed += (sender, args) =>
            {
                World.Current.SaveChanges();
            };
            SaveTimer.Start();
        }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<NPC> NPCs { get; set; }
        public DbSet<Hostile> Hostiles { get; set; }
        public DbSet<Message> Messages { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
        public void AddLocations(List<Location> LocationList)
        {

            foreach (var location in LocationList)
            {
                if (Locations.ToList().Exists(ai => ai.LocationID == location.LocationID))
                {
                    RemoveLocation(location);
                }
                Locations.Add(location);
            }
        }
        public void AddLocation(Location Location)
        {
            if (Locations.ToList().Exists(ai => ai.LocationID == Location.LocationID))
            {
                RemoveLocation(Location);
            }
            Locations.Add(Location);
        }
        public void RemoveLocations(List<Location> Locations)
        {
            foreach (var ai in Locations)
            {
                RemoveLocation(ai);
            }
        }
        public void RemoveLocation(Location Location)
        {
            Locations.ToList().RemoveAll(ai => ai.LocationID == Location.LocationID);
        }
    }
}
