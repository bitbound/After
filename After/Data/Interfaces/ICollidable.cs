using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Data.Interfaces
{
    public interface ICollidable
    {
        void OnCollision(GameObject collidingObject);
    }
}
