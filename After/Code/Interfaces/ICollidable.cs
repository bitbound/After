using After.Code.Models;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Interfaces
{
    public interface ICollidable
    {
        Rectangle Location { get; }
        void OnCollision(ICollidable collidingObject);
    }
}
