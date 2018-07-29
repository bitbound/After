using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace After.Code.Models
{
    public class Scene
    {
        public GameObject Anchor { get; set; }

        public Rectangle Location
        {
            get
            {
                return Anchor.Location;
            }
        }

        public List<GameObject> SceneObjects { get; set; }
        public IClientProxy ClientProxy { get; internal set; }
    }
}
