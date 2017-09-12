using System.Collections.Generic;

namespace Translucency.WebSockets
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

        public void Broadcast(string Message, WebSocketClient Sender)
        {
            foreach (var client in ClientList)
            {
                client.SendString(Message);
            }
        }
        private WebSocketServer()
        {
        }
    }
}
