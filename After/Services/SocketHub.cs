using After.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Services
{
    [Authorize]
    public class SocketHub : Hub
    {
        private DataService DataService { get; set; }
        private HttpContext HttpContext { get; set; }
        public SocketHub(DataService dataService, IHttpContextAccessor contextAccessor)
        {
            DataService = dataService;
            HttpContext = contextAccessor.HttpContext;
            
        }
        public async Task SendChat(JObject data)
        {
            var character = DataService.GetCharacter(HttpContext.User.Identity.Name, Context.Items["CharacterName"].ToString());
            switch (data["Channel"].ToString())
            {
                case "Global":
                    await Clients.All.SendAsync("ChatMessage", new {
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

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public void Init(string characterName)
        {
            Context.Items["CharacterName"] = characterName;
            SendFullSceneUpdate();
        }

        public void SendFullSceneUpdate()
        {
            var characterName = Context.Items["CharacterName"].ToString();
            var playerCharacter = DataService.GetCharacter(HttpContext.User.Identity.Name, characterName);
            Clients.Caller.SendAsync("PlayerUpdate", playerCharacter);
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            return base.OnDisconnectedAsync(exception);
        }
    }
}
