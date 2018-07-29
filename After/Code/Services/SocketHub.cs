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

        public static Dictionary<string, string> ConnectionList { get; set; } = new Dictionary<string, string>();
        private string CharacterName
        {
            get
            {
                return this.Context.Items["CharacterName"].ToString();
            }
            set
            {
                this.Context.Items["CharacterName"] = value;
            }
        }

        private PlayerCharacter CurrentCharacter
        {
            get
            {
                return DataService.GetCharacter(Context.User.Identity.Name, CharacterName);
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
            if (ConnectionList.ContainsKey(UserName))
            {
                await Clients.Client(ConnectionList[UserName]).SendAsync("DisconnectDuplicateConnection");
                await Task.Delay(2000);
                if (ConnectionList.ContainsKey(UserName))
                {
                    await Clients.Caller.SendAsync("FailLoginDueToExistingConnection");
                    return;
                }
            }
            ConnectionList.Add(UserName, Context.ConnectionId);
            CharacterName = characterName;
            SendFullSceneUpdate();
        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            ConnectionList.Remove(UserName);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendChat(JObject data)
        {
            var character = DataService.GetCharacter(Context.User.Identity.Name, CharacterName);
            switch (data["Channel"].ToString())
            {
                case "Global":
                    await Clients.All.SendAsync("ReceiveChat", new {
                        Channel = data["Channel"].ToString(),
                        CharacterName = character?.Name,
                        Message =  data["Message"].ToString(),
                        Color = character?.Color
                    });
                    break;
                default:
                    break;
            }
        }
        public void SendFullSceneUpdate()
        {
            Clients.Caller.SendAsync("UpdatePlayer", CurrentCharacter);
        }
    }
}
