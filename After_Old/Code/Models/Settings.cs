using System.Collections.Generic;

namespace After.Models
{
    public class Settings
    {
        public Dictionary<string, string> UIColors { get; set; } = new Dictionary<string, string>()
        {
            { "GlobalChat", "rgb(0, 255, 64)" },
            { "VoidChat", "rgb(0, 220, 255)" },
            { "Whisper", "magenta" },
            { "System", "lightgray" },
            { "Debug", "rgb(150,50,50)" }
        };

        public Dictionary<string, string> InputModeAliases { get; set; } = new Dictionary<string, string>()
        {
            { "Command", "rgb(0, 255, 65)" },
            { "GlobalChat", "rgb(0, 220, 255)" },
            { "LocalChat", "magenta" },
            { "Whisper", "lightgray" }
        };
    }
}