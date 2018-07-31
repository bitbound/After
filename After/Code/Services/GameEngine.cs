using After.Code.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
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
        public GameEngine(ILogger<GameEngine> logger, IConfiguration configuration)
        {
            Current = this;
            Logger = logger;
            Configuration = configuration;
        }
        public void Init()
        {
            var options = new DbContextOptions<ApplicationDbContext>();
            DBContext = new ApplicationDbContext(options, Configuration);
            LastTick = DateTime.Now;
            MainLoop = Task.Run(new Action(RunMainLoop));
        }
        private IConfiguration Configuration { get; }
        private ApplicationDbContext DBContext { get; set; }
        private ILogger<GameEngine> Logger { get; set; }
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

            var activeConnections = SocketHub.ConnectionList.ToList();
            
            var playerIDs = activeConnections.Select(x => x.CharacterID).ToList();

            ApplyStatusEffects(playerIDs, delta);
            Logger.LogDebug($"Before ApplyInput: {(DateTime.Now - LastTick).TotalMilliseconds / 50}");
            ApplyInputUpdates(playerIDs, delta);
            Logger.LogDebug($"After ApplyInput: {(DateTime.Now - LastTick).TotalMilliseconds / 50}");
            UpdatePositionsFromVelociy(playerIDs, delta);
            Logger.LogDebug($"Before Diff: {(DateTime.Now - LastTick).TotalMilliseconds / 50}");
            DiffScenesAndSendUpdates(activeConnections);
            Logger.LogDebug($"After Diff: {(DateTime.Now - LastTick).TotalMilliseconds / 50}");

            System.Threading.Thread.Sleep(1);
            RunMainLoop();
        }

        private void DiffScenesAndSendUpdates(List<ConnectionDetails> activeConnections)
        {
            activeConnections.ForEach(x => {
                var currentScene = GetCurrentScene(x.CharacterID);
                x.CachedScene = currentScene;
                var diffScene = currentScene.Except(x.CachedScene).ToList();
                if (diffScene.Count > 0 && x.ClientProxy != null)
                {
                    x.ClientProxy.SendCoreAsync("UpdateScene", new object[] { diffScene });
                }
            });
        }

        private void ApplyInputUpdates(List<Guid> gameObjectIDs, double delta)
        {
            gameObjectIDs.ForEach(x =>
            {
                var gameObject = GetGameObject(x);
                if (gameObject.MovementForce > 0)
                {
                    var radians = Utilities.GetRadiansFromDegrees(gameObject.MovementAngle);
                    var xVector = -Math.Cos(radians) * gameObject.MovementForce * gameObject.AccelerationSpeed * delta;
                    var yVector = -Math.Sin(radians) * gameObject.MovementForce * gameObject.AccelerationSpeed * delta;
                    if (!Utilities.IsAccelerating(gameObject.VelocityX, xVector))
                    {
                        xVector *= gameObject.DecelerationSpeed;
                    }
                    if (!Utilities.IsAccelerating(gameObject.VelocityY, yVector))
                    {
                        yVector *= gameObject.DecelerationSpeed;
                    }
                    gameObject.VelocityX += xVector;
                    gameObject.VelocityY += yVector;
                    gameObject.VelocityX = Math.Max(gameObject.MaxVelocity, Math.Min(0, gameObject.VelocityX));
                    gameObject.VelocityY = Math.Max(gameObject.MaxVelocity, Math.Min(0, gameObject.VelocityY));
                }
                else if (gameObject.MovementForce == 0)
                {
                    if (gameObject.VelocityX > 0)
                    {
                        gameObject.VelocityX = Math.Min(0, gameObject.VelocityX - (gameObject.DecelerationSpeed * delta));
                    }
                    if (gameObject.VelocityY > 0)
                    {
                        gameObject.VelocityY = Math.Min(0, gameObject.VelocityY - (gameObject.DecelerationSpeed * delta));
                    }
                }
            });
        }

        private void ApplyStatusEffects(List<Guid> gameObjectIDs, double delta)
        {
            
        }

        private void AddAndRemoveSceneObjectsInEachScene(List<Guid> gameObjectIDs, double delta)
        {
            
        }

        private void UpdatePositionsFromVelociy(List<Guid> gameObjectIDs, double delta)
        {
            
        }




        private DateTime LastTick { get; set; }

        private List<GameObject> GetCurrentScene(Guid characterID)
        {
            var anchor = DBContext.GameObjects.AsNoTracking().FirstOrDefault(x => x.ID == characterID);
            var scene = DBContext.GameObjects
                .AsNoTracking()
                .Where(x =>
                    x.ZCoord == anchor.ZCoord &&
                    Math.Abs(x.XCoord - anchor.XCoord) < AppConstants.RendererWidth &&
                    Math.Abs(x.YCoord - anchor.YCoord) < AppConstants.RendererHeight);

            return scene.ToList();
        }

        private GameObject GetGameObject(Guid id)
        {
            return DBContext.GameObjects.AsNoTracking().FirstOrDefault(x => x.ID == id);
        }
    }
}
