using After.Code.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;
using System.Timers;

namespace After.Code.Services
{
    public class GameEngine
    {
        public GameEngine(DataService dataService, SceneManager sceneManager, ILogger<GameEngine> logger)
        {
            DataService = dataService;
            SceneManager = sceneManager;
            Logger = logger;
        }

        public void Init()
        {
            LastTick = DateTime.Now;
            MainLoop = Task.Run(new Action(RunMainLoop));
        }

        private ILogger<GameEngine> Logger { get; set; }
        private DataService DataService { get; set; }
        private SceneManager SceneManager { get; }
        private Task MainLoop { get; set; }
        private void RunMainLoop()
        {
            var delta = (DateTime.Now - LastTick).TotalMilliseconds / 50;
            if (delta < 1)
            {
                System.Threading.Thread.Sleep(10);
                RunMainLoop();
                return;
            }
            if (delta > 2)
            {
                Logger.LogWarning($"Slow game loop.  Delta: {delta.ToString()}");
            }
            LastTick = DateTime.Now;

            var activeScenes = SceneManager.AllScenes;

            ApplyStatusEffects(activeScenes, delta);

            ApplyInputUpdates(activeScenes, delta);

            UpdatePositionsFromVelociy(activeScenes, delta);

            AddAndRemoveSceneObjectsInEachScene(activeScenes, delta);

            activeScenes.ForEach(x =>
            {
                if (Utilities.IsDifferent(x, x.ShadowScene))
                {
                    x.ShadowScene = x;
                    DataService.UpdateScene(x);
                    x.ClientProxy.SendCoreAsync("UpdateScene", new object[] { x.Anchor });
                }
            });


            System.Threading.Thread.Sleep(10);
            RunMainLoop();
        }

        private void ApplyInputUpdates(List<Scene> scenes, double delta)
        {
            var updateFunc = new Action<GameObject>(x =>
            {
                if (x.MovementForce > 0)
                {
                    var radians = Utilities.GetRadiensFromDegrees(x.MovementAngle);
                    var xVector = -Math.Cos(radians) * x.MovementForce * x.AccelerationSpeed * delta;
                    var yVector = -Math.Sin(radians) * x.MovementForce * x.AccelerationSpeed * delta;
                    if (!Utilities.IsAccelerating(x.VelocityX, xVector))
                    {
                        xVector *= x.DecelerationSpeed;
                    }
                    if (!Utilities.IsAccelerating(x.VelocityY, yVector))
                    {
                        yVector *= x.DecelerationSpeed;
                    }
                    x.VelocityX += xVector;
                    x.VelocityY += yVector;
                    x.VelocityX = Math.Max(x.MaxVelocity, Math.Min(0, x.VelocityX));
                    x.VelocityY = Math.Max(x.MaxVelocity, Math.Min(0, x.VelocityY));
                }
                else if (x.MovementForce == 0)
                {
                    if (x.VelocityX > 0)
                    {
                        x.VelocityX = Math.Min(0, x.VelocityX - (x.DecelerationSpeed * delta));
                    }
                    if (x.VelocityY > 0)
                    {
                        x.VelocityY = Math.Min(0, x.VelocityY - (x.DecelerationSpeed * delta));
                    }
                }

            });

            scenes.ForEach(x =>
            {
                updateFunc(x.Anchor);
                x.SceneObjects.ForEach(y =>
                {
                    updateFunc(y);
                });
            });
        }

        private void ApplyStatusEffects(List<Scene> scenes, double delta)
        {
            
        }

        private void AddAndRemoveSceneObjectsInEachScene(List<Scene> scenes, double delta)
        {
            
        }

        private void UpdatePositionsFromVelociy(List<Scene> scenes, double delta)
        {
            
        }




        private DateTime LastTick { get; set; }
    }
}
