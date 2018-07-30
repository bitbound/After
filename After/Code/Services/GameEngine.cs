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
        public static GameEngine Current { get; private set; }
        public GameEngine(ApplicationDbContext dbContext, SceneManager sceneManager, ILogger<GameEngine> logger)
        {
            DBContext = dbContext;
            SceneManager = sceneManager;
            SceneManager.GameEngine = this;
            Logger = logger;
        }
        public ApplicationDbContext DBContext { get; set; }
        public void Init()
        {
            Current = this;
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

            activeScenes.ForEach(x =>
            {
                ApplyStatusEffects(x, delta);
                ApplyInputUpdates(x, delta);
                UpdatePositionsFromVelociy(x, delta);
                if (Utilities.IsDifferent(x, x.ShadowScene))
                {
                    x.ShadowScene = x;
                    DBContext.GameObjects.Update(x.Anchor);
                    x.SceneObjects.ForEach(y =>
                    {
                        DBContext.GameObjects.Update(y);
                    });
                    if (x.ClientProxy != null)
                    {
                        x.ClientProxy.SendCoreAsync("UpdateScene", new object[] { x });
                    }
                }
            });

            DBContext.SaveChanges();
            RunMainLoop();
        }

        private void ApplyInputUpdates(Scene scene, double delta)
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

            updateFunc(scene.Anchor);
            scene.SceneObjects.ForEach(x =>
            {
                updateFunc(x);
            });
        }

        private void ApplyStatusEffects(Scene scenes, double delta)
        {
            
        }

        private void AddAndRemoveSceneObjectsInEachScene(Scene scenes, double delta)
        {
            
        }

        private void UpdatePositionsFromVelociy(Scene scene, double delta)
        {
            var updateFunc = new Action<GameObject>(x =>
            {

            });

            updateFunc(scene.Anchor);
            scene.SceneObjects.ForEach(y =>
            {
                updateFunc(y);
            });
        }




        private DateTime LastTick { get; set; }
    }
}
