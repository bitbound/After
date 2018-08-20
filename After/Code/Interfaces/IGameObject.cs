using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Interfaces
{
    public interface IGameObject
    {
        string ID { get; set; }
        double VelocityX { get; set; }
        double VelocityY { get; set; }
    }
}
