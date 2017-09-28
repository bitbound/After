using After;
using After.Models;
using Really_Dynamic;
using Newtonsoft.Json.Linq;
using Really_Dynamic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Translucency.WebSockets
{
    public class WebSocketClient
    {
        public WebSocketClient(WebSocket Socket)
        {
            ClientSocket = Socket;
        }

        /// <summary>
        /// The websocket for this client.
        /// </summary>
        public WebSocket ClientSocket { get; set; }

        /// <summary>
        /// The Player associated with this connection.
        /// </summary>
        public Player Player { get; set; }

        /// <summary>
        /// Indicates if the user has authenticated yet.
        /// </summary>
        public bool Authenticated { get; set; }

        /// <summary>
        /// A list of timestamps for the last 20 requests.  Used for DoS/brute force protection.
        /// </summary>
        public List<DateTime> RequestHistory { get; set; } = new List<DateTime>();

        /// <summary>
        /// An event that's fired whenever a string message is received.
        /// </summary>
        public event EventHandler<dynamic> StringMessageReceived;

        /// <summary>
        /// An event that's fired whenever a binary message is received.
        /// </summary>
        public event EventHandler<byte[]> BinaryMessageReceived;

        /// <summary>
        /// An event that's fired when the socket closes.
        /// </summary>
        public event EventHandler SocketClosed;

        /// <summary>
        /// An event that fires when an error occurs while reading from the websocket.
        /// </summary>
        public event EventHandler<Exception> SocketError;

        /// <summary>
        /// Send a JSON message to the client.
        /// </summary>
        /// <param name="JsonRequest">The message to send to the client.</param>
        public async Task SendJSON(dynamic JsonRequest)
        {
            var jsonRequest = JSON.Encode(JsonRequest);
            await SendString(jsonRequest);
        }

        /// <summary>
        /// Send a byte array message to the client.
        /// </summary>
        /// <param name="ByteArray">The message to send to the client.</param>
        public async Task SendBytes(byte[] ByteArray)
        {
            var outBuffer = new ArraySegment<byte>(ByteArray);
            SendBuffer.Add(outBuffer);
            if (SendBuffer.Count > 1)
            {
                return;
            }
            while (SendBuffer.Count > 0)
            {
                var segment = SendBuffer[0];
                await ClientSocket.SendAsync(segment, WebSocketMessageType.Text, true, CancellationToken.None);
                SendBuffer.Remove(segment);
            }
        }
        /// <summary>
        /// Send a string message to the client.
        /// </summary>
        /// <param name="MessageString">The message to send to the client.</param>
        public async Task SendString(string MessageString)
        {
            var outBuffer = Encoding.UTF8.GetBytes(MessageString);
            await SendBytes(outBuffer);
        }
        
        /// <summary>
        /// Continuously reads data from the websocket.
        /// </summary>
        public async Task HandleSocket()
        {
            try
            {
                var buffer = new byte[Utilities.Server.ReceiveBufferSize];
                WebSocketReceiveResult result = await ClientSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                await ParseMessage(result, buffer);
                while (!ClientSocket.CloseStatus.HasValue)
                {
                    buffer = new byte[Utilities.Server.ReceiveBufferSize];
                    result = await ClientSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                    await ParseMessage(result, buffer);
                }
                if (Utilities.Server.ClientList.Contains(this))
                {
                    Utilities.Server.ClientList.Remove(this);
                }
                await ClientSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
            }
            catch (Exception ex)
            {
                if (Utilities.Server.ClientList.Contains(this))
                {
                    Utilities.Server.ClientList.Remove(this);
                }
                await ClientSocket.CloseOutputAsync(WebSocketCloseStatus.InternalServerError, "An unhandled exception occurred.", CancellationToken.None);
                SocketError?.Invoke(this, ex);
                SocketClosed?.Invoke(this, EventArgs.Empty);
                ClientSocket.Dispose();
            }
        }

        /// <summary>
        /// Parses the result of data read from the websocket.
        /// </summary>
        /// <param name="Result">The WebSocketReceiveResult.</param>
        /// <param name="ReadBuffer">The byte array buffer read from the socket stream.</param>
        private async Task ParseMessage(WebSocketReceiveResult Result, byte[] ReadBuffer)
        {
            if (!Result.EndOfMessage)
            {
                return;
            }
            RequestHistory.Add(DateTime.Now);
            while (RequestHistory.Count > 20)
            {
                RequestHistory.RemoveAt(0);
            }
            if (RequestHistory.Where(time=>DateTime.Now - time < TimeSpan.FromSeconds(10)).Count() > 15)
            {
                if (Player.IsWarned)
                {
                    Player.IsBanned = true;
                    var request = new
                    {
                        Category = "Accounts",
                        Type = "Banned"
                    };
                    await SendJSON(request);
                    await ClientSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Banned.", CancellationToken.None);
                    ClientSocket.Dispose();
                    return;
                }
                else
                {
                    Player.IsWarned = true;
                    var request = new
                    {
                        Category = "Accounts",
                        Type = "Warned"
                    };
                    await SendJSON(request);
                    await ClientSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Warned.", CancellationToken.None);
                    ClientSocket.Dispose();
                    return;
                }
            }
            if (Result.MessageType == WebSocketMessageType.Text)
            {
                var trimmedString = Encoding.UTF8.GetString(TrimBytes(ReadBuffer));
                var jsonMessage = JSON.Decode(trimmedString);

                StringMessageReceived?.Invoke(this, jsonMessage);
            }
            else if (Result.MessageType == WebSocketMessageType.Binary)
            {
                BinaryMessageReceived?.Invoke(this, TrimBytes(ReadBuffer));
            }
            else if (Result.MessageType == WebSocketMessageType.Close)
            {
                SocketClosed?.Invoke(this, EventArgs.Empty);
            }
        }

        /// <summary>
        /// Removes trailing empty bytes in the buffer.
        /// </summary>
        /// <param name="Bytes">Byte array to trim.</param>
        /// <returns>Trimmed byte array.</returns>
        private byte[] TrimBytes(byte[] Bytes)
        {
            // Loop backwards through array until the first non-zero byte is found.
            var firstZero = 0;
            for (int i = Bytes.Length - 1; i >= 0; i--)
            {
                if (Bytes[i] != 0)
                {
                    firstZero = i + 1;
                    break;
                }
            }
            if (firstZero == 0)
            {
                throw new Exception("Byte array is empty.");
            }
            // Return non-empty bytes.
            return Bytes.Take(firstZero).ToArray();
        }

        /// <summary>
        /// The buffer to use for outgoing messages.
        /// </summary>
        private List<ArraySegment<byte>> SendBuffer { get; set; } = new List<ArraySegment<byte>>();
       
    }
}
