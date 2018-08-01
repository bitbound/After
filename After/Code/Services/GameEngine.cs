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
        public static GameEngine Current { get; private set; }
        public GameEngine(ILogger<GameEngine> logger, IConfiguration configuration, EmailSender emailSender)
        {
            Current = this;
            Logger = logger;
            Configuration = configuration;
            EmailSender = emailSender;
        }
        public void Init()
        {
            MainLoop = Task.Run(new Action(RunMainLoop));
        }
        private EmailSender EmailSender { get; set; }
        private IConfiguration Configuration { get; }
        private ApplicationDbContext DBContext { get; set; }
        private ILogger<GameEngine> Logger { get; set; }
        private Task MainLoop { get; set; }
        private void RunMainLoop()
        {
            while (true)
            {
                try
                {
                    var options = new DbContextOptions<ApplicationDbContext>();
                    DBContext = new ApplicationDbContext(options, Configuration);


                    var delta = (DateTime.Now - LastTick).TotalMilliseconds / 50;
                    while (delta < 1)
                    {
                        System.Threading.Thread.Sleep(1);
                        delta = (DateTime.Now - LastTick).TotalMilliseconds / 50;
                    }


                    if (delta > 2)
                    {
                        Logger.LogWarning($"Slow game loop.  Delta: {delta.ToString()}");
                    }
                    LastTick = DateTime.Now;



                    var activeConnections = SocketHub.ConnectionList.ToList();
                    var playerCharacters = DBContext.PlayerCharacters.Where(x => x is PlayerCharacter && activeConnections.Exists(y => y.CharacterID == x.ID)).ToList();

                    var visibleObjects = GetAllVisibleObjects(playerCharacters);

                    visibleObjects.ForEach(x =>
                    {
                        ApplyStatusEffects(x, delta);
                        ApplyInputUpdates(x, delta);
                        UpdatePositionsFromVelociy(x, delta);
                        if (x is PlayerCharacter)
                        {
                            SendUpdates(visibleObjects, activeConnections, x as PlayerCharacter);
                        }

                    });

                    visibleObjects.ForEach(x =>
                    {
                        x.ModifiedThisGameLoop = false;
                    });
                    DBContext.SaveChanges();
                }
                catch (Exception ex)
                {
                    try
                    {
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

        private void SendUpdates(List<GameObject> visibleObjects, List<ConnectionDetails> activeConnections, PlayerCharacter playerCharacters)
        {
            var connectionDetails = activeConnections.Find(x => x.CharacterID == playerCharacters.ID);
            var currentScene = GetCurrentScene(playerCharacters, visibleObjects);
    
            var modifiedObjects = currentScene?.Where(x => x.ModifiedThisGameLoop);
            var addedObjects = currentScene?.Where(x => connectionDetails.CachedScene?.Any(y => y.ID == x.ID) == false);
            var removedObjects = connectionDetails.CachedScene?.Where(x => currentScene?.Any(y => y.ID == x.ID) == false);
            if (modifiedObjects.Count() > 0 || addedObjects.Count() > 0 || removedObjects.Count() > 0)
            {
                connectionDetails?.ClientProxy?.SendCoreAsync("UpdateGameState", new object[] { currentScene });
            }
            connectionDetails.CachedScene = currentScene;


        }

        private void ApplyInputUpdates(GameObject gameObject, double delta)
        {
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
                gameObject.ModifiedThisGameLoop = true;
            }
            else if (gameObject.MovementForce == 0)
            {
                if (gameObject.VelocityX > 0)
                {
                    gameObject.VelocityX = Math.Min(0, gameObject.VelocityX - (gameObject.DecelerationSpeed * delta));
                    gameObject.ModifiedThisGameLoop = true;
                }
                if (gameObject.VelocityY > 0)
                {
                    gameObject.VelocityY = Math.Min(0, gameObject.VelocityY - (gameObject.DecelerationSpeed * delta));
                    gameObject.ModifiedThisGameLoop = true;
                }
            }
        }

        private void ApplyStatusEffects(GameObject gameObjectIDs, double delta)
        {
            
        }

        private void UpdatePositionsFromVelociy(GameObject gameObject, double delta)
        {
            if (gameObject.VelocityX > 0)
            {
                gameObject.XCoord += gameObject.VelocityX;
                gameObject.ModifiedThisGameLoop = true;
            }
            if (gameObject.VelocityY > 0)
            {
                gameObject.YCoord += gameObject.VelocityY;
                gameObject.ModifiedThisGameLoop = true;
            }
        }




        private DateTime LastTick { get; set; }

        private List<GameObject> GetAllVisibleObjects(List<PlayerCharacter> playerCharacters)
        {
            return DBContext.GameObjects.AsNoTracking().Where(go =>
                playerCharacters.Exists(pc=> pc.ZCoord == go.ZCoord) &&
                playerCharacters.Exists(pc=> Math.Abs(go.XCoord - pc.XCoord) < AppConstants.RendererWidth) &&
                playerCharacters.Exists(pc => Math.Abs(go.YCoord - pc.YCoord) < AppConstants.RendererHeight) &&
                (go is PlayerCharacter == false || playerCharacters.Any(x=>x.ID == go.ID))
            ).ToList();
        }
        private List<GameObject> GetCurrentScene(PlayerCharacter playerCharacter, List<GameObject> gameObjects)
        {
            return gameObjects.Where(go =>
                playerCharacter.ZCoord == go.ZCoord &&
                Math.Abs(go.XCoord - playerCharacter.XCoord) < AppConstants.RendererWidth &&
                Math.Abs(go.YCoord - playerCharacter.YCoord) < AppConstants.RendererHeight
            ).ToList();
        }
    }
}
