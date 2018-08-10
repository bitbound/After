using After.Code.Interfaces;
using After.Code.Services;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Models
{
    public class Projectile : GameObject, IExpirable, ICollidable, IDestructible
    {
        public Projectile(double magnitude, double force)
        {
            this.ID = Guid.NewGuid();
            var size = (int)(5 + (5 * magnitude));
            var speed = 20 + (20 * magnitude);
            this.Height = size;
            this.Width = size;
            this.AccelerationSpeed = speed;
            this.MaxVelocity = speed;
            this.Discriminator = "Projectile";
            this.MovementForce = 1;
            this.Magnitude = magnitude;
            this.CurrentEnergy = force;
        }
        public double Magnitude { get; set; }
        public DateTime Expiration { get; set; } = DateTime.Now.AddSeconds(3);
        public Guid Owner { get; set; }
        public double CurrentEnergy { get; set; }
        public Rectangle Location
        {
            get
            {
                return new Rectangle((int)XCoord, (int)YCoord, Width, Height);
            }
        }

        public void OnCollision(ICollidable collidingObject)
        {
            if (collidingObject.ID == this.Owner)
            {
                return;
            }
            else if (collidingObject is IDestructible)
            {
                var destructible = (collidingObject as IDestructible);
                var damageDealt = Math.Min(destructible.CurrentEnergy, CurrentEnergy);
                if (damageDealt > 0)
                {
                    destructible.CurrentEnergy -= damageDealt;
                    this.CurrentEnergy -= damageDealt;
                    if (destructible.CurrentEnergy == 0)
                    {
                        destructible.OnDestruction();
                    }
                    if (this.CurrentEnergy == 0)
                    {
                        this.OnDestruction();
                    }
                }
            }
        }

        public void OnDestruction()
        {
            var objectID = this.ID;
            GameEngine.Current.MemoryOnlyObjects.Remove(this);
            GameEngine.Current.GameEvents.Add(new GameEvent()
            {
                EventName = "ProjectileDestroyed",
                EventData = new Dictionary<string, dynamic>()
                {
                    { "Color", this.Color },
                    { "Angle", Utilities.GetOppositeAngle(this.MovementAngle) }
                },
                XCoord = this.XCoord,
                YCoord = this.YCoord,
                ZCoord = this.ZCoord
            });
        }
    }
}
