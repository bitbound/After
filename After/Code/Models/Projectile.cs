using After.Code.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Models
{
    public class Projectile : GameObject, IExpirable, ICollidable
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
            this.Force = force;
        }
        public double Magnitude { get; set; }
        public DateTime Expiration { get; set; } = DateTime.Now.AddSeconds(3);
        public Guid Owner { get; set; }
        public double Force { get; set; }

        public void OnCollision(GameObject collidingObject)
        {
            throw new NotImplementedException();
        }
    }
}
