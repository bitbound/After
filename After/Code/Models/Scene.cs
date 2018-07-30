using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;


namespace After.Code.Models
{
    public class Scene
    {
        public GameObject Anchor { get; set; }

        [JsonIgnore]
        public Rectangle Location
        {
            get
            {
                return Anchor.Location;
            }
        }

        [JsonIgnore]
        public Scene ShadowScene { get; set; }

        public List<GameObject> SceneObjects { get; set; } = new List<GameObject>();

        [JsonIgnore]
        public IClientProxy ClientProxy { get; internal set; }

    }
}
