using After.Code.Interfaces;
using After.Code.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
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
        public GameEngine(ILogger<GameEngine> logger, IConfiguration configuration, EmailSender emailSender)
        {
            Logger = logger;
            Configuration = configuration;
            EmailSender = emailSender;
        }
        public bool IsRunning { get; private set; }

        private IConfiguration Configuration { get; }

        private ApplicationDbContext DBContext { get; set; }

        private EmailSender EmailSender { get; set; }
        private DateTime LastEmailSent { get; set; } = DateTime.Now;

        private DateTime LastTick { get; set; }

        private ILogger<GameEngine> Logger { get; set; }

        private Task MainLoop { get; set; }

        public void Start()
        {
            if (IsRunning)
            {
                return;
            }
            IsRunning = true;
            MainLoop = Task.Run(new Action(RunMainLoop));
        }
        public void Stop()
        {
            IsRunning = false;
        }
        private void ApplyAcceleration(GameObject gameObject, double delta, double xAcceleration, double yAcceleration)
        {
            if (gameObject.MovementForce > 0)
            {
                var totalAcceleration = (Math.Abs(xAcceleration) + Math.Abs(yAcceleration));
                var maxVelocityX = gameObject.MaxVelocity * (Math.Abs(xAcceleration) / totalAcceleration) * gameObject.MovementForce;
                var maxVelocityY = gameObject.MaxVelocity * (Math.Abs(yAcceleration) / totalAcceleration) * gameObject.MovementForce;
                gameObject.VelocityX += xAcceleration;
                gameObject.VelocityY += yAcceleration;
                gameObject.VelocityX = Math.Max(-maxVelocityX, Math.Min(maxVelocityX, gameObject.VelocityX));
                gameObject.VelocityY = Math.Max(-maxVelocityY, Math.Min(maxVelocityY, gameObject.VelocityY));
                gameObject.Modified = true;
            }
        }

        private void ApplyDeceleration(GameObject gameObject, double delta, double xAcceleration, double yAcceleration)
        {
            if (xAcceleration * gameObject.VelocityX <= 0 && gameObject.VelocityX != 0)
            {
                if (gameObject.VelocityX > 0)
                {
                    gameObject.VelocityX = Math.Max(0, gameObject.VelocityX - (gameObject.DecelerationSpeed * delta));
                    gameObject.Modified = true;
                }
                else if (gameObject.VelocityX < 0)
                {
                    gameObject.VelocityX = Math.Min(0, gameObject.VelocityX + (gameObject.DecelerationSpeed * delta));
                    gameObject.Modified = true;
                }
            }
            if (yAcceleration * gameObject.VelocityY <= 0 && gameObject.VelocityY != 0)
            {
                if (gameObject.VelocityY > 0)
                {
                    gameObject.VelocityY = Math.Max(0, gameObject.VelocityY - (gameObject.DecelerationSpeed * delta));
                    gameObject.Modified = true;
                }
                else if (gameObject.VelocityY < 0)
                {
                    gameObject.VelocityY = Math.Min(0, gameObject.VelocityY + (gameObject.DecelerationSpeed * delta));
                    gameObject.Modified = true;
                }
            }
        }

        private void ApplyInputUpdates(GameObject gameObject, double delta)
        {
            var radians = Utilities.GetRadiansFromDegrees(gameObject.MovementAngle);
            var xAcceleration = -Math.Cos(radians) * gameObject.MovementForce * gameObject.AccelerationSpeed * delta;
            var yAcceleration = -Math.Sin(radians) * gameObject.MovementForce * gameObject.AccelerationSpeed * delta;
            ApplyAcceleration(gameObject, delta, xAcceleration, yAcceleration);
            ApplyDeceleration(gameObject, delta, xAcceleration, yAcceleration);
        }

        private void ApplyStatusEffects(GameObject gameObjectIDs, double delta)
        {

        }

        private List<GameObject> GetAllVisibleObjects(List<PlayerCharacter> playerCharacters)
        {
            var allObjects = DBContext.GameObjects.Where(go =>
                playerCharacters.Exists(pc => pc.ZCoord == go.ZCoord) &&
                playerCharacters.Exists(pc => Math.Abs(go.XCoord - pc.XCoord) < AppConstants.RendererWidth) &&
                playerCharacters.Exists(pc => Math.Abs(go.YCoord - pc.YCoord) < AppConstants.RendererHeight) &&
                (go is PlayerCharacter == false || playerCharacters.Any(x => x.ID == go.ID))
            ).ToList();
            lock (MemoryOnlyObjects)
            {
                allObjects.AddRange(MemoryOnlyObjects);
            }
            return allObjects;
        }
        public List<GameObject> MemoryOnlyObjects { get; set; } = new List<GameObject>();
        private List<GameObject> GetCurrentScene(PlayerCharacter playerCharacter, List<GameObject> gameObjects)
        {
            return gameObjects.Where(go =>
                playerCharacter.ZCoord == go.ZCoord &&
                Math.Abs(go.XCoord - playerCharacter.XCoord) < AppConstants.RendererWidth &&
                Math.Abs(go.YCoord - playerCharacter.YCoord) < AppConstants.RendererHeight
            ).ToList();
        }

        private void RunMainLoop()
        {
            while (IsRunning)
            {
                try
                {
                    DBContext = new ApplicationDbContext(new DbContextOptions<ApplicationDbContext>(), Configuration);

                    var delta = (DateTime.Now - LastTick).TotalMilliseconds / 50;
                    
                    while (delta < 1)
                    {
                        System.Threading.Thread.Sleep(1);
                        delta = (DateTime.Now - LastTick).TotalMilliseconds / 50;
                    }


                    if (delta > 2)
                    {
                        Logger.LogWarning($"Slow game loop.  Delta: {delta.ToString()}");
                        var error = new Error()
                        {
                            PathWhereOccurred = "Main Engine Loop",
                            Message = $"Slow game loop.  Delta: {delta.ToString()}",
                            Timestamp = DateTime.Now
                        };
                        DBContext.Errors.Add(error);
                    }
                    LastTick = DateTime.Now;



                    var activeConnections = SocketHub.ConnectionList.ToList();
                    var playerCharacters = DBContext.PlayerCharacters.Where(x => x is PlayerCharacter && activeConnections.Exists(y => y.CharacterID == x.ID)).ToList();

                    var visibleObjects = GetAllVisibleObjects(playerCharacters);

                    visibleObjects.ForEach(x =>
                    {
                        if (IsExpired(x))
                        {
                            return;
                        }
                        ApplyStatusEffects(x, delta);
                        ApplyInputUpdates(x, delta);
                        UpdatePositionsFromVelociy(x, delta);
                        // TODO: Check collisions.
                    });
                    visibleObjects.ForEach(x =>
                    {
                        if (x is PlayerCharacter)
                        {
                            SendUpdates(visibleObjects, activeConnections, x as PlayerCharacter);
                        }
                    });
                    
                    visibleObjects.ForEach(x =>
                    {
                        x.Modified = false;
                    });
                    DBContext.SaveChanges();

                    DBContext.Database.CloseConnection();
                    DBContext.Dispose();
                    visibleObjects.Clear();
                }
                catch (Exception ex)
                {
                    try
                    {
                        if (DateTime.Now - LastEmailSent < TimeSpan.FromMinutes(1))
                        {
                            return;
                        }
                        LastEmailSent = DateTime.Now;
                        var error = new Error()
                        {
                            PathWhereOccurred = "Main Engine Loop",
                            Message = ex.Message,
                            StackTrace = ex.StackTrace,
                            Source = ex.Source,
                            Timestamp = DateTime.Now
                        };
                        DBContext.Errors.Add(error);
                        DBContext.SaveChanges();
                        EmailSender.SendEmail("jared@lucent.rocks", "jared@lucent.rocks", "After Server Error", JsonConvert.SerializeObject(error));
                    }
                    catch{ }
                }
             
            }
        }

        private bool IsExpired(GameObject x)
        {
            if (x is IExpirable && (x as IExpirable).Expiration < DateTime.Now)
            {
                if (MemoryOnlyObjects.Contains(x))
                {
                    MemoryOnlyObjects.Remove(x as Projectile);
                }
                else
                {
                    DBContext.GameObjects.Remove(x);
                }
                return true;
            }
            else
            {
                return false;
            }
        }

        private void SendUpdates(List<GameObject> visibleObjects, List<ConnectionDetails> activeConnections, PlayerCharacter playerCharacters)
        {
            var connectionDetails = activeConnections.Find(x => x.CharacterID == playerCharacters.ID);
            var currentScene = GetCurrentScene(playerCharacters, visibleObjects);
    
            var modifiedObjects = currentScene?.Where(x => x.Modified);
            var addedObjects = currentScene?.Where(x => connectionDetails.CachedScene?.Any(y => y.ID == x.ID) == false);
            var removedObjects = connectionDetails.CachedScene?.Where(x => currentScene?.Any(y => y.ID == x.ID) == false);
            if (modifiedObjects.Count() > 0 || addedObjects.Count() > 0 || removedObjects.Count() > 0)
            {
                connectionDetails?.ClientProxy?.SendCoreAsync("UpdateGameState", new object[] { currentScene });
            }
            connectionDetails.CachedScene = currentScene;


        }
        private void UpdatePositionsFromVelociy(GameObject gameObject, double delta)
        {
            if (gameObject.VelocityX != 0)
            {
                gameObject.XCoord = Math.Round(gameObject.XCoord + gameObject.VelocityX);
                gameObject.Modified = true;
            }
            if (gameObject.VelocityY != 0)
            {
                gameObject.YCoord = Math.Round(gameObject.YCoord + gameObject.VelocityY);
                gameObject.Modified = true;
            }
        }
    }
}
