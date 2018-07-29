using System;
using System.Collections.Generic;
using System.Text;
using After.Code.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace After.Code
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<GameObject>()
                .HasIndex(x => new { x.XCoord, x.YCoord, x.ZCoord });

            builder.Entity<PlayerCharacter>()
                .HasIndex(x => x.Name)
                .IsUnique();

            builder.Entity<AfterUser>()
                .HasIndex(x => x.UserName);
        }

        public new DbSet<AfterUser> Users { get; set; }

        public DbSet<PlayerCharacter> PlayerCharacters { get; set; }

        public DbSet<GameObject> GameObjects { get; set; }

        public DbSet<Error> Errors { get; set; }

        public DbSet<StatusEffect> StatusEffects { get; set; }

    }
}
