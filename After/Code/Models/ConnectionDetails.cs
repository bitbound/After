using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace After.Code.Models
{
    public class ConnectionDetails
    {
        public string UserName { get; set; }
        public string ConnectionID { get; set; }
        public string CharacterName { get; set; }
        public string CharacterID { get; set; }
        public List<GameObject> CachedScene { get; set; } = new List<GameObject>();
        public IClientProxy ClientProxy { get; internal set; }
    }
}
