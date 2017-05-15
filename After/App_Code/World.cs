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
    public class World
    {
        public static World Current { get; set; } = new World();
        public World()
        {
            var server = HttpContext.Current.Server;
            Locations.FolderPath = server.MapPath("~/App_Data/World_Data/Locations");
            Players.FolderPath = server.MapPath("~/App_Data/World_Data/Players");
            NPCs.FolderPath = server.MapPath("~/App_Data/World_Data/NPCs");
            Messages.FolderPath = server.MapPath("~/App_Data/World_Data/Messages");
            Landmarks.FolderPath = server.MapPath("~/App_Data/World_Data/Landmarks");
            Locations.PersistenceFilter = new Predicate<Location>(loc => loc.IsStatic == true);
            Messages.PersistenceFilter = new Predicate<Message>(mes => Messages.Storage.IndexOfValue(mes) > 50);
        }
        public StorageList<Player> Players { get; set; } = new StorageList<Player>();
        public StorageList<Location> Locations { get; set; } = new StorageList<Location>();
        public StorageList<NPC> NPCs { get; set; } = new StorageList<NPC>();
        public StorageList<Message> Messages { get; set; } = new StorageList<Message>();
        public StorageList<Landmark> Landmarks { get; set; } = new StorageList<Landmark>();

        public Location CreateTempLocation(string[] XYZ)
        {
            var location = new Location();
            location.XCoord = double.Parse(XYZ[0]);
            location.YCoord = double.Parse(XYZ[1]);
            location.ZCoord = XYZ[2];
            location.Color = "black";
            location.Description = "A completely empty area.";
            location.Title = "Empty Area";
            Locations.Add(location);
            return location;
        }
    }
}
