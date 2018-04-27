using System;
using After.Dependencies.StorageLists;
using After.Models;
using System.IO;

namespace After
{
    public class Storage
    {
        public static Storage Current { get; set; } = new Storage();
        public Storage()
        {
            Locations.FolderPath = Path.Combine(App.DataPath, "Storage\\Locations");
            Players.FolderPath = Path.Combine(App.DataPath, "Storage\\Players");
            NPCs.FolderPath = Path.Combine(App.DataPath, "Storage\\NPCs");
            Messages.FolderPath = Path.Combine(App.DataPath, "Storage\\Messages");
            Locations.PersistenceFilter = new Predicate<Location>(loc => loc.IsStatic == true);
        }
        public StorageList<Player> Players { get; set; } = new StorageList<Player>();
        public StorageList<Location> Locations { get; set; } = new StorageList<Location>();
        public StorageList<NPC> NPCs { get; set; } = new StorageList<NPC>();
        public StorageList<Message> Messages { get; set; } = new StorageList<Message>();
    }
}
