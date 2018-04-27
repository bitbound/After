using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Net.WebSockets;
using System.Threading;
using After.Dependencies.WebSockets;
using System.Linq;
using After.Models;
using System.Collections.Generic;
using After.Dependencies;

namespace After
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvcCore().AddRazorPages((options) =>
            {
                options.Conventions.AllowAnonymousToPage("/");
            });
            services.AddAuthorization(options => { options.DefaultPolicy = null; });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            var startTime = DateTime.Now;
            loggerFactory.AddConsole();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            App.RootPath = System.IO.Path.Combine(env.ContentRootPath, "wwwroot");
            App.StartUp();
            WebSocketServer.Create("After");
            app.UseStaticFiles();
            var webSocketOptions = new WebSocketOptions()
            {
                ReceiveBufferSize = 10 * 1024
            };
            app.UseWebSockets(webSocketOptions);
            app.Use(async (context, next) =>
            {
                if (context.WebSockets.IsWebSocketRequest)
                {
                    WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    var client = new WebSocketClient(webSocket);
                    client.StringMessageReceived += async (sender, jsonMessage) =>
                    {
                        var wsClient = sender as WebSocketClient;
                        string type = jsonMessage.Type;
                        if (jsonMessage == null || String.IsNullOrEmpty(type))
                        {
                            throw new Exception("Type is null in socket message.");
                        }

                        if (wsClient.IsAuthenticated != true)
                        {
                            if (type != "Logon" && type != "AccountCreation" && type != "ForgotPassword")
                            {
                                await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, null, CancellationToken.None);
                                webSocket.Dispose();
                                return;
                            }
                        }
                        var methodHandler = Type.GetType("After.Code.Classes.WebSockets.MessageHandlers").GetMethods().FirstOrDefault(mi => mi.Name == "Receive" + type);
                        if (methodHandler != null)
                        {
                            try
                            {
                                methodHandler.Invoke(null, new object[] { jsonMessage, client });
                            }
                            catch (Exception ex)
                            {
                                Utilities.WriteError(ex);
                            }
                        }
                    };
                    client.SocketClosed += async (sender, args) =>
                    {
                        var wsClient = sender as WebSocketClient;
                        var clientList = WebSocketServer.ServerList["After"].ClientList;
                        if (clientList.Contains(wsClient))
                        {
                            clientList.Remove(wsClient);
                        }
                        if (wsClient?.Player?.Name == null)
                        {
                            return;
                        }
                        dynamic message = new
                        {
                            Type = "Disconnected",
                            Username = wsClient?.Player.Name
                        };
                        await WebSocketServer.ServerList["After"].Broadcast(JSON.Encode(message));
                        var player = wsClient?.Player as Player;
                        Storage.Current.Players.Store(player.StorageID);
                        player.GetCurrentLocation()?.CharacterLeaves(player);
                        foreach (var timer in player.Timers)
                        {
                            timer.Value.Stop();
                            timer.Value.Dispose();
                        }
                    };
                    await client.HandleSocket();
                }
                else
                {
                    await next();
                }
            });
            app.UseMvc();
            var bootTime = DateTime.Now - startTime;
            Utilities.WriteLog("DIAGNOSTICS", $"Boot time took {bootTime.TotalSeconds} seconds.{Environment.NewLine}");
            //app.Run(async (context) =>
            //{
            //    await context.Response.WriteAsync("Hello World!");
            //});
        }
    }
}
