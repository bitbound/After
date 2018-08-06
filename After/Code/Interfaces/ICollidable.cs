using After.Code.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Interfaces
{
    public interface ICollidable
    {
        void OnCollision(GameObject collidingObject);
    }
}
