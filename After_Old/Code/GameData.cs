using After.Dependencies;
using After.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code
{
    public static class GameData
    {
        public static List<Command> Commands
        {
            get
            {
                var strCommands = File.ReadAllText(Path.Combine(App.DataPath, "GameData\\Base\\Commands.json"));
                return JSON.Decode<List<Command>>(strCommands);
            }
        }
        public static List<Location> Locations
        {
            get
            {
                var strLocations = File.ReadAllText(Path.Combine(App.DataPath, "GameData\\Base\\Locations.json"));
                return JSON.Decode<List<Location>>(strLocations);
            }
        }
        public static List<NPC> NPCs
        {
            get
            {
                var strPowers = File.ReadAllText(Path.Combine(App.DataPath, "GameData\\Base\\NPCs.json"));
                return JSON.Decode<List<NPC>>(strPowers);
            }
        }
        public static List<Power> Powers
        {
            get
            {
                var strPowers = File.ReadAllText(Path.Combine(App.DataPath, "GameData\\Base\\Powers.json"));
                return JSON.Decode<List<Power>>(strPowers);
            }
        }
    }
}
