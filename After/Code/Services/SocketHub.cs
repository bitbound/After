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
    public class SocketHub : Hub
    {
        public SocketHub(DataService dataService,
            IHttpContextAccessor contextAccessor,
            UserManager<AfterUser> userManager,
            SignInManager<AfterUser> signInManager)
        {
            DataService = dataService;
            UserManager = userManager;
            SignInManager = signInManager;
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
            DataService.UpdateCharacterMovement(characterID, 0, 0);
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
        }
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            ConnectionList.RemoveAll(x=>x.UserName == UserName);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendChat(dynamic data)
        {
            var character = DataService.GetCharacter(Context.User.Identity.Name, ConnectionDetails.CharacterName);
            switch (data["Channel"].ToString())
            {
                case "Global":
                    await Clients.All.SendAsync("ReceiveChat", new
                    {
                        Channel = data["Channel"],
                        CharacterName = character?.Name,
                        Message = data["Message"],
                        Color = character?.Color
                    });
                    break;

                default:
                    break;
            }
        }

        public void SendInitialUpdate()
        {
            Clients.Caller.SendAsync("InitialUpdate", new { CurrentCharacter, AppConstants.RendererWidth, AppConstants.RendererHeight } );
        }
        public void UpdateMovementInput(dynamic data)
        {
            DataService.UpdateCharacterMovement(ConnectionDetails.CharacterID, (double)data.Angle, (double)data.Force);
        }
    }
}