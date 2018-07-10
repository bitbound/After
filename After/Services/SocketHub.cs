using After.Data;
using Microsoft.AspNetCore.Authorization;
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
        public SocketHub(DataService dataService)
        {
            DataService = DataService;
        }
        public async Task SendMessage(JObject message)
        {
           
        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }


        public override Task OnDisconnectedAsync(Exception exception)
        {
            return base.OnDisconnectedAsync(exception);
        }
    }
}
