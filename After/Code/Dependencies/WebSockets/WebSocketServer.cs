using System.Collections.Generic;
using System.Threading.Tasks;

namespace After.Dependencies.WebSockets
{
    public class WebSocketServer
    {
        /// <summary>
        /// A list of WebSocketServers currently instantiated.
        /// </summary>
        public static Dictionary<string, WebSocketServer> ServerList { get; set; } = new Dictionary<string, WebSocketServer>();

        /// <summary>
        /// Default buffer size for socket connections.
        /// </summary>
        public int ReceiveBufferSize { get; set; } = 10 * 1024;

        /// <summary>
        /// A list of clients currently connected to this server.
        /// </summary>
        public List<WebSocketClient> ClientList { get; set; } = new List<WebSocketClient>();

        /// <summary>
        /// Create a new WebSocketServer and add to the ServerList.
        /// </summary>
        /// <param name="ServerName">A unique name to identify the server.</param>
        /// <returns>The newly-created server.</returns>
        public static WebSocketServer Create(string ServerName)
        {
            var server = new WebSocketServer();
            ServerList.Add(ServerName, server);
            return server;
        }

        public async Task Broadcast(string Message)
        {
            foreach (var client in ClientList)
            {
                await client.SendString(Message);
            }
        }
        private WebSocketServer()
        {
        }
    }
}
