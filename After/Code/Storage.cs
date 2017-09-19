using System;
using StorageLists;
using After.Models;
using System.IO;

namespace After
{
    public class Storage
    {
        public static Storage Current { get; set; } = new Storage();
        public Storage()
        {
            Locations.FolderPath = Path.Combine(Utilities.DataPath, "Storage\\Locations");
            Players.FolderPath = Path.Combine(Utilities.DataPath, "Storage\\Players");
            NPCs.FolderPath = Path.Combine(Utilities.DataPath, "Storage\\NPCs");
            Messages.FolderPath = Path.Combine(Utilities.DataPath, "Storage\\Messages");
            Landmarks.FolderPath = Path.Combine(Utilities.DataPath, "Storage\\Landmarks");
            Locations.PersistenceFilter = new Predicate<Location>(loc => loc.IsStatic == true);
            Messages.PersistenceFilter = new Predicate<Message>(mes => Messages.Storage.IndexOfValue(mes) > 50);
        }
        public StorageList<Player> Players { get; set; } = new StorageList<Player>();
        public StorageList<Location> Locations { get; set; } = new StorageList<Location>();
        public StorageList<NPC> NPCs { get; set; } = new StorageList<NPC>();
        public StorageList<Message> Messages { get; set; } = new StorageList<Message>();
        public StorageList<Landmark> Landmarks { get; set; } = new StorageList<Landmark>();
    }
}
