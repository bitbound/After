using After.Code.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Services
{
    public class SceneManager
    {
        private List<Scene> Scenes { get; set; } = new List<Scene>();

        internal void AddScene(Scene scene)
        {
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
    }
}
