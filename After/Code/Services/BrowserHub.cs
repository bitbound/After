using After.Code.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Services
{
    [Authorize]
    public class BrowserHub : Hub
    {
        public BrowserHub(DataService dataService,
            IHttpContextAccessor contextAccessor,
            UserManager<AfterUser> userManager,
            SignInManager<AfterUser> signInManager,
            GameEngine gameEngine)
        {
            DataService = dataService;
            UserManager = userManager;
            SignInManager = signInManager;
            GameEngine = gameEngine;
        }

        public static List<ConnectionDetails> ConnectionList { get; set; } = new List<ConnectionDetails>();

        private ConnectionDetails ConnectionDetails
        {
            get
            {
                return this.Context.Items["ConnectionDetails"] as ConnectionDetails;
            }
            set
            {
                this.Context.Items["ConnectionDetails"] = value;
            }
        }

        private PlayerCharacter CurrentCharacter
        {
            get
            {
                return DataService.GetCharacter(Context.User.Identity.Name, ConnectionDetails.CharacterName);
            }
        }

        private AfterUser CurrentUser
        {
            get
            {
                return DataService.GetUser(Context.User.Identity.Name);
            }
        }

        private DataService DataService { get; set; }
        private UserManager<AfterUser> UserManager { get; }
        private SignInManager<AfterUser> SignInManager { get; }
        private GameEngine GameEngine { get; }

        private string UserName
        {
            get
            {
                return Context.User.Identity.Name;
            }
        }

        public async Task Init(string characterName)
        {
            if (ConnectionList.Any(x => x.UserName == UserName))
            {
                await ConnectionList.FirstOrDefault(x => x.UserName == UserName).ClientProxy.SendAsync("DisconnectDuplicateConnection");
                var startWait = DateTime.Now;
                while (ConnectionList.Any(x => x.UserName == UserName))
                {
                    await Task.Delay(100);
                    if (DateTime.Now > startWait.AddSeconds(3))
                    {
                        await Clients.Caller.SendAsync("FailLoginDueToExistingConnection");
                        return;
                    }
                }
            }
            var characterID = DataService.GetCharacter(UserName, characterName).ID;
            GameEngine.InputQueue.Enqueue(dbContext =>
            {
                var character = dbContext.PlayerCharacters.Find(characterID);
                character.MovementAngle = 0;
                character.MovementForce = 0;
            });
            ConnectionDetails = new ConnectionDetails()
            {
                CharacterName = characterName,
                CharacterID = characterID,
                UserName = UserName,
                ConnectionID = Context.ConnectionId,
                ClientProxy = Clients.Caller
            };
            SendInitialUpdate();

            lock (ConnectionList) {
                ConnectionList.Add(ConnectionDetails);
            }
            await Clients.All.SendAsync("CharacterConnected", characterName);
        }
        public override Task OnConnectedAsync()
        {
            if (!GameEngine.IsRunning)
            {
                GameEngine.Start();
            }
            return base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            GameEngine.InputQueue.Enqueue(dbContext =>
            {
                dbContext.SaveChanges();
            });
            ConnectionList.RemoveAll(x=>x.UserName == UserName);
            await Clients.All.SendAsync("CharacterDisconnected", CurrentCharacter.Name);
            if (ConnectionList.Count == 0)
            {
                GameEngine.Stop();
                DataService.CleanupTempUsers();
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendChat(string channel, string message)
        {
            var character = DataService.GetCharacter(Context.User.Identity.Name, ConnectionDetails.CharacterName);
            switch (channel.ToString())
            {
                case "Global":
                    await Clients.All.SendAsync("ReceiveChat", channel, character?.Name, message, character?.Color);
                    break;

                default:
                    break;
            }
        }
        public void BeginCharging()
        {
            var characterID = CurrentCharacter.ID;
            GameEngine.InputQueue.Enqueue(dbContext =>
            {
                var character = dbContext.PlayerCharacters.Find(characterID);
                if (character != null)
                {
                    character.IsCharging = true;
                }
            });
        }
        public void ReleaseCharging(double angle)
        {
            var characterID = CurrentCharacter.ID;
            var radians = Utilities.GetRadiansFromDegrees(angle);
            var xVector = -Math.Cos(radians);
            var yVector = -Math.Sin(radians);
            GameEngine.InputQueue.Enqueue(dbContext =>
            {
                var character = dbContext.PlayerCharacters.Find(characterID);
                if (character.IsDead)
                {
                    return;
                }
                if (character != null)
                {
                    var magnitude = character.ChargePercent;
                    character.IsCharging = false;
                    
                    var projectile = new Projectile(magnitude, character.CurrentCharge)
                    {
                        XCoord = character.XCoord + (character.Width / 2),
                        YCoord = character.YCoord + (character.Height / 2),
                        ZCoord = character.ZCoord,
                        OwnerID = characterID,
                        MovementAngle = angle,
                        Color = character.Color

                    };
                    
                    lock (GameEngine.MemoryOnlyObjects)
                    {
                        GameEngine.MemoryOnlyObjects.Add(projectile);
                    }
                    character.CurrentCharge = 0;
                    GameEngine.Current.GameEvents.Add(new GameEvent()
                    {
                        EventName = "ProjectileFired",
                        EventData = new Dictionary<string, dynamic>()
                        {
                            { "Color", character.Color }
                        },
                        XCoord = character.XCoord + ((character.Width / 2) + (xVector * character.Width)),
                        YCoord = character.YCoord + ((character.Height / 2) + (yVector * character.Height)),
                        ZCoord = character.ZCoord
                    });
                }
            });
        }
        public void SendInitialUpdate()
        {
            Clients.Caller.SendAsync("InitialUpdate", CurrentCharacter, AppConstants.RendererWidth, AppConstants.RendererHeight);
        }
        public void UpdateMovementInput(double angle, double force)
        {
            var characterID = ConnectionDetails.CharacterID;
            GameEngine.InputQueue.Enqueue(dbContext =>
            {
                var character = dbContext.PlayerCharacters.Find(characterID);
                if (character.IsDead)
                {
                    return;
                }
                character.MovementAngle = angle;
                character.MovementForce = force;
            });
        }
        public void Ping(long time)
        {
            Clients.Caller.SendAsync("Ping", time);
        }
    }
}