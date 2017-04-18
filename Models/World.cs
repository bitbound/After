using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Data.Entity;


namespace Models
{
    public class World : DbContext
    {
        public static World Current { get; set; } = new World();
        public World()
        {
            SaveTimer = new System.Timers.Timer(60000);
            SaveTimer.Elapsed += (sender, args) =>
            {
                World.Current.SaveChanges();
            };
            SaveTimer.Start();
        }
        public System.Timers.Timer SaveTimer { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<NPC> NPCs { get; set; }
        public DbSet<Hostile> Hostiles { get; set; }
        public DbSet<Character> Characters { get; set; }
        public DbSet<Message> Messages { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //Database.SetInitializer(new MigrateDatabaseToLatestVersion<World, Configuration>());
            Database.SetInitializer(new DropCreateDatabaseIfModelChanges<World>());
        }
    }
}
