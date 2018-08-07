using After.Code.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Models
{
    public class Projectile : GameObject, IExpirable, ICollidable
    {
        public Projectile()
        {
            this.ID = Guid.NewGuid();
            this.Height = 5;
            this.Width = 5;
            this.AccelerationSpeed = 20;
            this.MaxVelocity = 20;
            this.Discriminator = "Projectile";
            this.MovementForce = 1;
        }

        public DateTime Expiration { get; set; } = DateTime.Now.AddSeconds(3);
        public Guid Owner { get; set; }

        public void OnCollision(GameObject collidingObject)
        {
            throw new NotImplementedException();
        }
    }
}
