using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace After.Models
{
    public class World
    {
        public World()
        {
            
        }
        public override string ToString()
        {
            return Name;
        }
        #region Load Methods
        //public static async Task<World> Load(string WorldName)
        //{
        //    var sf = await StorageFile.GetFileFromPathAsync(ApplicationData.Current.LocalFolder.Path + @"\Worlds\" + WorldName + ".xml");
        //    var strWorld = await FileIO.ReadTextAsync(sf);
        //    var newWorld = await Utilities.Deserialize(strWorld) as World;
        //    return newWorld;
        //}
        //public static async Task<World> LoadDefaultExplore()
        //{
        //    var sf = await StorageFile.GetFileFromApplicationUriAsync(new Uri(@"ms-appx:///Data/World - Explore Default.xml"));
        //    var strWorld = await FileIO.ReadTextAsync(sf);
        //    var newWorld = await Utilities.Deserialize(strWorld) as World;
        //    return newWorld;
        //}
        //public static async Task<World> LoadDefaultStory()
        //{
        //    var sf = await StorageFile.GetFileFromApplicationUriAsync(new Uri(@"ms-appx:///Data/World - Story Default.xml"));
        //    var strWorld = await FileIO.ReadTextAsync(sf);
        //    var newWorld = await Utilities.Deserialize(strWorld) as World;
        //    return newWorld;
        //}
        #endregion Load Methods
        public string Name { get; set; }
        public Guid WorldID { get; set; } = Guid.NewGuid();
        public Location StartLocation { get; set; }
        
        public List<Location> AreaInformation { get; set; } = new List<Location>();

        public List<Character> Characters { get; set; } = new List<Character>();


        public void AddLocations(List<Location> Locations)
        {
            foreach (var location in Locations)
            {
                if (AreaInformation.Exists(ai => ai.XYZ == location.XYZ))
                {
                    RemoveLocation(location);
                }
                AreaInformation.Add(location);
            }
        }
        public void AddLocation(Location Location)
        {
            if (AreaInformation.Exists(ai => ai.XYZ == Location.XYZ))
            {
                RemoveLocation(Location);
            }
            AreaInformation.Add(Location);
        }
        public void RemoveLocations(List<Location> Locations)
        {
            foreach (var ai in Locations)
            {
                RemoveLocation(ai);
            }
        }
        public void RemoveLocation(Location Location)
        {
            AreaInformation.RemoveAll(ai => ai.XYZ == Location.XYZ);
        }
    }
}
