var After;
(function (After) {
    var App;
    (function (App) {
        class Settings {
            constructor() {
                this.UIColors = {
                    "GlobalChat": "rgb(0, 255, 64)",
                    "VoidChat": "rgb(0, 220, 255)",
                    "Whisper": "magenta",
                    "System": "lightgray",
                    "Debug": "rgb(150,50,50)"
                };
                this.InputModeAliases = {
                    Command: "/c ",
                    GlobalChat: "/g ",
                    LocalChat: "/l ",
                    Whisper: "/w "
                };
            }
        }
        App.Settings = Settings;
    })(App = After.App || (After.App = {}));
})(After || (After = {}));
//# sourceMappingURL=Settings.js.map