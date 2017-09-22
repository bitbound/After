using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Net.WebSockets;
using System.Threading;
using Translucency.WebSockets;
using System.Linq;
using After.Models;
using System.Collections.Generic;
using Really_Dynamic;

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
            Utilities.RootPath = System.IO.Path.Combine(env.ContentRootPath, "wwwroot");
            Utilities.StartUp();
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
                        string category = jsonMessage.Category;
                        string type = jsonMessage.Type;
                        if (jsonMessage == null || String.IsNullOrEmpty(category) || String.IsNullOrEmpty(type))
                        {
                            throw new Exception("Category or Type is null within Socket_Handler.OnMessage.");
                        }

                        if (wsClient.Authenticated != true)
                        {
                            if (category != "Accounts" || (type != "Logon" && type != "AccountCreation" && type != "ForgotPassword"))
                            {
                                await webSocket.CloseOutputAsync(WebSocketCloseStatus.NormalClosure, null, CancellationToken.None);
                                return;
                            }
                        }
                        var methodHandler = Type.GetType("After.Message_Handlers." + category).GetMethods().FirstOrDefault(mi => mi.Name == "Handle" + type);
                        if (methodHandler != null)
                        {
                            try
                            {
                                if (category == "Messages" && type == "Admin")
                                {
                                    After.Message_Handlers.Messages.HandleAdmin(jsonMessage, client);
                                }
                                else
                                {
                                    methodHandler.Invoke(null, new object[] { jsonMessage, client });
                                }
                            }
                            catch (Exception ex)
                            {
                                After.Utilities.WriteError(ex);
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
                            Category = "Accounts",
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
                    //Utilities.Server.ClientList.Add(client);
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
