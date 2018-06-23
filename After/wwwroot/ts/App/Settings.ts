namespace After.App {
    export class Settings {
        public UIColors = {
            "GlobalChat": "rgb(0, 255, 64)",
            "VoidChat": "rgb(0, 220, 255)",
            "Whisper": "magenta",
            "System": "lightgray",
            "Debug": "rgb(150,50,50)"
        };
        public InputModeAliases = {
            Command: "/c ",
            GlobalChat: "/g ",
            LocalChat: "/l ",
            Whisper: "/w "
        };
    }
}