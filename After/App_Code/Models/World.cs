using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Data.Entity;
using System.Data.Entity.Migrations;

namespace After.Models
{
    public class World : DbContext
    {
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
    }
}
