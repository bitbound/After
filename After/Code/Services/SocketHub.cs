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
            SignInManager<AfterUser> signInManager,
            SceneManager sceneManager)
        {
            DataService = dataService;
            UserManager = userManager;
            SignInManager = signInManager;
            SceneManager = sceneManager;
        }

        public static List<ConnectionDetails> ConnectionList { get; set; } = new List<ConnectionDetails>();

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
        private SceneManager SceneManager { get; }

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
            lock (ConnectionList) {
                ConnectionList.Add(
                   new ConnectionDetails()
                   {
                       CharacterName = characterName,
                       UserName = UserName,
                       ConnectionID = Context.ConnectionId,
                       ClientProxy = Clients.Caller
                   }
                );
            }

            CharacterName = characterName;
            MyScene = new Scene()
            {
                Anchor = DataService.GetCharacter(UserName, CharacterName),
                ClientProxy = Clients.Caller
            };
            SceneManager.AddScene(MyScene);

            //SendFullSceneUpdate();
        }
        private Scene MyScene { get; set; }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            ConnectionList.RemoveAll(x=>x.UserName == UserName);
            SceneManager.RemoveScene(MyScene);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendChat(JObject data)
        {
            var character = DataService.GetCharacter(Context.User.Identity.Name, CharacterName);
            switch (data["Channel"].ToString())
            {
                case "Global":
                    await Clients.All.SendAsync("ReceiveChat", new
                    {
                        Channel = data["Channel"].ToString(),
                        CharacterName = character?.Name,
                        Message = data["Message"].ToString(),
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