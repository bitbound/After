using After.Code.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Services
{
    public class SceneManager
    {
        public GameEngine GameEngine { get; set; }
        private List<Scene> Scenes { get; set; } = new List<Scene>();

        public List<Scene> AllScenes
        {
            get
            {
                lock (Scenes)
                {
                    return Scenes.ToList();
                }
            }
        }

        internal void AddScene(Scene scene)
        {
            scene.Anchor = GameEngine.DBContext.GameObjects.Find(scene.AnchorID);
            lock (Scenes)
            {
                Scenes.Add(scene);
            }
        }

        internal void RemoveScene(Scene scene)
        {
            lock (Scenes)
            {
                Scenes.Remove(scene);
            }
        }

        public Scene CloneScene(Scene scene)
        {
            return JsonConvert.DeserializeObject<Scene>(JsonConvert.SerializeObject(scene));
        }
    }
}
