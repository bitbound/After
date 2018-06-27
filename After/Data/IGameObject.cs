using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace After.Data
{
    public interface IGameObject
    {
        int Height { get; set; }
        bool IsCollisionEnabled { get; set; }
        int Width { get; set; }
        double XCoord { get; set; }
        double YCoord { get; set; }
        double ZCoord { get; set; }

        Rectangle Rect { get; }
    }
}
