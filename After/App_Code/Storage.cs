using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Web.Helpers;
using StorageLists;
using System.Web;
using After.Models;

namespace After
{
    public class Storage
    {
        public static Storage Current { get; set; } = new Storage();
        public Storage()
        {
            var server = HttpContext.Current.Server;
            Locations.FolderPath = server.MapPath("~/App_Data/Storage/Locations");
            Players.FolderPath = server.MapPath("~/App_Data/Storage/Players");
            NPCs.FolderPath = server.MapPath("~/App_Data/Storage/NPCs");
            Messages.FolderPath = server.MapPath("~/App_Data/Storage/Messages");
            Landmarks.FolderPath = server.MapPath("~/App_Data/Storage/Landmarks");
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
