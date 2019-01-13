using System;
using System.Collections.Generic;
using System.Text;
using After.Code.Models;
using After.Code.Services;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace After.Code
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IConfiguration configuration)
            : base(options)
        {
            Configuration = configuration;
            this.Database.Migrate();
        }
        private IConfiguration Configuration { get; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //optionsBuilder.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            optionsBuilder.UseSqlite(Configuration.GetConnectionString("SQLite"));
            optionsBuilder.UseLoggerFactory(AppConstants.CustomLogger);
            base.OnConfiguring(optionsBuilder);
        }
        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<GameObject>().HasIndex(x => x.ID).IsUnique();

            builder.Entity<GameObject>()
                .HasIndex(x => new { x.XCoord, x.YCoord, x.ZCoord });

            builder.Entity<Character>()
                .HasIndex(x => x.Name)
                .IsUnique();

            builder.Entity<AfterUser>()
                .HasIndex(x => x.UserName);
        }

        public new DbSet<AfterUser> Users { get; set; }

        public DbSet<PlayerCharacter> PlayerCharacters { get; set; }

        public DbSet<Character> Characters { get; set; }

        public DbSet<GameObject> GameObjects { get; set; }

        public DbSet<Error> Errors { get; set; }

        public DbSet<StatusEffect> StatusEffects { get; set; }
    }
}
