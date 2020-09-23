using After.Code.Enums;
using After.Code.Interfaces;
using After.Code.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Numerics;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;

namespace After.Code.Services
{
    public class GameEngine : BackgroundService
    {
        public static GameEngine Current { get; set; }
        public GameEngine(
            EmailSender emailSender, 
            ILogger<GameEngine> logger,
            IConfiguration configuration,
            IHubContext<BrowserHub> hubContext,
            IServiceProvider serviceProvider)
        {
            Current = this;
            Logger = logger;
            Configuration = configuration;
            EmailSender = emailSender;
            HubContext = hubContext;
            DBContext = serviceProvider
                .CreateScope()
                .ServiceProvider
                .GetRequiredService<ApplicationDbContext>();
        }
        private IHubContext<BrowserHub> HubContext { get; set; }
        public ConcurrentQueue<Action<ApplicationDbContext>> InputQueue { get; set; } = new ConcurrentQueue<Action<ApplicationDbContext>>();
        public List<GameEvent> GameEvents { get; set; } = new List<GameEvent>();
        public List<GameObject> MemoryOnlyObjects { get; set; } = new List<GameObject>();
        private IConfiguration Configuration { get; }

        private ApplicationDbContext DBContext { get; set; }
        private EmailSender EmailSender { get; set; }
        private DateTime LastEmailSent { get; set; } = DateTime.Now;

        private DateTime LastTick { get; set; }
        private DateTime LastDBSave { get; set; } = DateTime.Now;

        private ILogger<GameEngine> Logger { get; set; }

        private void ApplyAcceleration(GameObject gameObject, double delta, double xAcceleration, double yAcceleration)
        {
            if (gameObject.MovementForce > 0)
            {
                var totalAcceleration = (Math.Abs(xAcceleration) + Math.Abs(yAcceleration));
                var maxVelocityX = gameObject.MaxVelocity * (Math.Abs(xAcceleration) / totalAcceleration) * gameObject.MovementForce;
                gameObject.VelocityX += xAcceleration;
                gameObject.VelocityX = Math.Max(-maxVelocityX, Math.Min(maxVelocityX, gameObject.VelocityX));
                var maxVelocityY = gameObject.MaxVelocity * (Math.Abs(yAcceleration) / totalAcceleration) * gameObject.MovementForce;
                gameObject.VelocityY += yAcceleration;
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

        private void ApplyStatUpdates(GameObject gameObject, double delta)
        {
            if (gameObject is Character)
            {
                var character = gameObject as Character;
                if (character.IsDead)
                {
                    if (character.StatusEffects.Find(x=>x.Type == StatusEffectTypes.Dead).Expiration < DateTime.Now)
                    {
                        character.StatusEffects.RemoveAll(x=>x.Type == StatusEffectTypes.Dead);
                        character.CurrentEnergy = character.MaxEnergy;
                        character.XCoord = character.AnchorX;
                        character.YCoord = character.AnchorY;
                        character.ZCoord = character.AnchorZ;
                        GameEvents.Add(new GameEvent()
                        {
                            EventName = "SoulReturned",
                            EventData = new Dictionary<string, dynamic>()
                            {
                                {"CharacterID", character.ID }
                            },
                            XCoord = character.XCoord,
                            YCoord = character.YCoord,
                            ZCoord = character.ZCoord
                        });
                        character.Modified = true;
                    }
                    return;
                }
                if (character.IsCharging)
                {
                    character.CurrentCharge = Math.Min(character.MaxCharge, character.CurrentCharge + (delta * (character.MaxCharge / 40)));
                    character.Modified = true;
                }
            }
        }

        private List<GameObject> GetAllVisibleObjects(List<PlayerCharacter> playerCharacters)
        {
            var allObjects = DBContext.GameObjects.Include("StatusEffects").ToList().Where(go =>
                playerCharacters.Exists(pc => pc.ZCoord == go.ZCoord) &&
                playerCharacters.Exists(pc => Math.Abs(go.XCoord - pc.XCoord) < AppConstants.RendererWidth) &&
                playerCharacters.Exists(pc => Math.Abs(go.YCoord - pc.YCoord) < AppConstants.RendererHeight) &&
                (go is PlayerCharacter == false || playerCharacters.Any(x => x.ID == go.ID))
            ).ToList();
            allObjects.AddRange(MemoryOnlyObjects);
            return allObjects;
        }
        private List<GameObject> GetCurrentScene(PlayerCharacter playerCharacter, List<GameObject> gameObjects)
        {
            return gameObjects.Where(go =>
                playerCharacter.ZCoord == go.ZCoord &&
                Math.Abs(go.XCoord - playerCharacter.XCoord) < AppConstants.RendererWidth &&
                Math.Abs(go.YCoord - playerCharacter.YCoord) < AppConstants.RendererHeight
            ).ToList();
        }
        private IEnumerable<GameEvent> GetNearbyEvents(GameObject gameObject)
        {
            return GameEvents.Where(ge =>
                gameObject.ZCoord == ge.ZCoord &&
                Math.Abs(ge.XCoord - gameObject.XCoord) < AppConstants.RendererWidth &&
                Math.Abs(ge.YCoord - gameObject.YCoord) < AppConstants.RendererHeight
            );
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

        private void RunMainLoop()
        {
            List<PlayerCharacter> playerCharacters;
            List<GameObject> visibleObjects;
            while (true)
            {
                try
                {
                    if (BrowserHub.ConnectionList.Count == 0)
                    {
                        Thread.Sleep(1000);
                        continue;
                    }
                    // TODO: Remove these dummy users later.
                    while (DBContext.Characters.Count(x=> !(x is PlayerCharacter)) < 5)
                    {
                        DBContext.Characters.Add(new Character()
                        {
                            Name = "TargetDummy" + Guid.NewGuid().ToString().Replace("-", "").Substring(0, 10),
                            XCoord = new Random().Next(-500, 500),
                            YCoord = new Random().Next(-500, 500),
                            Color = Utilities.GetRandomHexColor(),
                            AnchorX = 0,
                            AnchorY = 0,
                            AnchorZ = "0",
                            CoreEnergy = DBContext.PlayerCharacters.Any() ? DBContext.PlayerCharacters.Average(x => x.CoreEnergy) : 100
                        });
                        DBContext.SaveChanges();
                    }

                    if (DateTime.Now - LastDBSave > TimeSpan.FromMinutes(5) &&
                        !DBContext.Database.IsInMemory())
                    {
                        DBContext.SaveChanges();
                        DBContext.Database.CloseConnection();
                        DBContext.Dispose();
                        DBContext = new ApplicationDbContext(new DbContextOptions<ApplicationDbContext>(), Configuration);
                        LastDBSave = DateTime.Now;
                    }
                    var delta = GetDelta();

                    ProcessInputQueue();

                    var activeCharacters = BrowserHub.ConnectionList.Values.Select(x => x.CharacterID);

                    playerCharacters = DBContext.PlayerCharacters
                        .Include(x => x.StatusEffects)
                        .Where(x => x is PlayerCharacter && activeCharacters.Contains(x.ID)).ToList();
                    visibleObjects = GetAllVisibleObjects(playerCharacters);


                    visibleObjects.ForEach(x =>
                    {
                        if (IsExpired(x))
                        {
                            return;
                        }
                        ApplyStatUpdates(x, delta);
                        ApplyInputUpdates(x, delta);
                        UpdatePositionsFromVelociy(x, delta);
                    });

                    CheckForCollisions(visibleObjects.Where(x => x is ICollidable).Cast<ICollidable>());

                    SendUpdates(visibleObjects, BrowserHub.ConnectionList.Values.ToList());
                    
                    visibleObjects.ForEach(x =>
                    {
                        x.Modified = false;
                    });

                    visibleObjects.Clear();
                    GameEvents.Clear();
                }
                catch (DbUpdateConcurrencyException ex)
                {
                    continue;
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
                        if (DateTime.Now - LastEmailSent < TimeSpan.FromMinutes(1))
                        {
                            continue;
                        }
                        LastEmailSent = DateTime.Now;
                        EmailSender.SendEmail("jared@lucency.co", "jared@lucency.co", "After Server Error", JsonConvert.SerializeObject(error));
                        continue;
                    }
                    catch
                    {
                        continue;

                    }
                }
            }
        }

        private double GetDelta()
        {
            var delta = (DateTime.Now - LastTick).TotalMilliseconds / 50;
            Debug.WriteLine("Delta: " + delta);
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
            return delta;
        }

        private void ProcessInputQueue()
        {
            for (var i = 0; i < InputQueue.Count; i++)
            {
                if (InputQueue.TryDequeue(out var action))
                {
                    action.Invoke(DBContext);
                }
            }
        }

        private void CheckForCollisions(IEnumerable<ICollidable> visibleObjects)
        {
            foreach (var collidable in visibleObjects)
            {
                foreach (var intersectingObject in visibleObjects.Where(y => y != collidable && y.Location.IntersectsWith(collidable.Location)))
                {
                    collidable.OnCollision(intersectingObject);
                }
            };
        }

        private void SendUpdates(List<GameObject> visibleObjects, List<ConnectionDetails> activeConnections)
        {
            foreach (var playerCharacter in visibleObjects)
            {
                if (playerCharacter is PlayerCharacter)
                {
                    var connectionDetails = activeConnections.Find(x => x.CharacterID == playerCharacter.ID);
                    if (connectionDetails == null)
                    {
                        continue;
                    }
                    var currentScene = GetCurrentScene((PlayerCharacter)playerCharacter, visibleObjects);

                    var modifiedObjects = currentScene?.Where(x => x.Modified);
                    var addedObjects = currentScene?.Where(x => connectionDetails.CachedScene?.Any(y => y.ID == x.ID) == false);
                    var removedObjects = connectionDetails.CachedScene?.Where(x => currentScene?.Any(y => y.ID == x.ID) == false);
                    if (modifiedObjects.Count() > 0 || addedObjects.Count() > 0 || removedObjects.Count() > 0)
                    {
                        HubContext.Clients.Client(connectionDetails.ConnectionID).SendAsync("UpdateGameState", currentScene);
                    }
                    connectionDetails.CachedScene = currentScene;

                    var events = GetNearbyEvents(playerCharacter);
                    if (events.Count() > 0)
                    {
                        HubContext.Clients.Client(connectionDetails.ConnectionID).SendAsync("ShowGameEvents", events);
                    }
                }
            }
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

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            return Task.Run(RunMainLoop, stoppingToken);
        }
    }
}
