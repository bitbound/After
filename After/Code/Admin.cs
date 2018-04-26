using Really_Dynamic;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace After
{
    public static class Admin
    {
        public static async Task BroadcastMessage(string Message, string From, string Channel)
        {
            var jsonMessage = new
            {
                Category = "Messages",
                Type = "Chat",
                Username = From,
                Channel = Channel,
                Message = Message
            };
            await App.Server.Broadcast(JSON.Encode(jsonMessage));
        }
        public static void DeletePlayer(string Name)
        {
            Storage.Current.Players.Remove(Name);
            foreach (var file in Directory.GetFiles(Path.Combine(App.DataPath, "Storage\\Landmarks")).Where(file => file.ToLower().Contains(Name.ToLower())))
            {
                File.Delete(file);
            }
            foreach (var file in Directory.GetFiles(Path.Combine(App.DataPath, "Storage\\Locations")).Where(file => file.ToLower().Contains(Name.ToLower())))
            {
                File.Delete(file);
            }
            foreach (var file in Directory.GetFiles(Path.Combine(App.DataPath, "Storage\\Players")).Where(file => file.ToLower().Contains(Name.ToLower())))
            {
                File.Delete(file);
            }
        }
    }
}
