using After.Dependencies.StorageLists;
using After.Data;
using System;
using System.IO;

namespace After
{
    public static class Storage
    {

        public static StorageList<Player> Players { get; set; } = new StorageList<Player>()
        {
            FolderPath = Path.Combine(App.DataPath, "Storage\\Players")
        };

        public static StorageList<Location> Locations { get; set; } = new StorageList<Location>()
        {
            FolderPath = Path.Combine(App.DataPath, "Storage\\Locations")
        };
        public static StorageList<NPC> NPCs { get; set; } = new StorageList<NPC>()
        {
            FolderPath = Path.Combine(App.DataPath, "Storage\\NPCs")
        };
        public static StorageList<Message> Messages { get; set; } = new StorageList<Message>()
        {
            FolderPath = Path.Combine(App.DataPath, "Storage\\Messages")
        };
    }
}