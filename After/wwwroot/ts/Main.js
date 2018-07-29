/// <reference path="../lib/pixi-particles/ambient.d.ts" />
import { Sound } from "./App/Sound.js";
import { Me } from "./App/Me.js";
import { UI } from "./App/UI.js";
import { Utilities } from "./App/Utilities.js";
import { Sockets } from "./App/Sockets.js";
import { Settings } from "./App/Settings.js";
import { PixiHelper } from "./App/PixiHelper.js";
import { Input } from "./App/Input.js";
var main = new class {
    constructor() {
        this.ErrorLog = "";
        this.Input = Input;
        this.Me = Me;
        this.PixiHelper = PixiHelper;
        this.Renderer = new PIXI.Application({
            view: document.querySelector("#playCanvas"),
            width: Settings.RendererResolution.Width,
            height: Settings.RendererResolution.Height
        });
        this.Sound = Sound;
        this.UI = UI;
        this.Utilities = Utilities;
        this.Settings = Settings;
        this.Sockets = Sockets;
    }
    StartGameLoop() {
        Main.Renderer.ticker.add(delta => gameLoop(delta));
    }
};
window.onerror = (ev, source, fileNo, columnNo, error) => {
    var errorMessage = `${new Date().toLocaleString()}  |  File: ${fileNo}  |  Column: ${columnNo}  |  Message: ${error.message}  |  Stack: ${error.stack}`.replace("\r\n", "<br>");
    main.ErrorLog += errorMessage + "<br><br>";
};
window["After"] = main;
export const Main = main;
// Register service worker.
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/ts/Worker.js', { scope: "/ts/" })
        .then(function (reg) {
        console.log("Service worker registered.");
    }).catch(function (err) {
        console.log("Error registering service worker:", err);
    });
}
// Catch add to home prompt.
window.addEventListener("beforeinstallprompt", (ev) => {
    ev.preventDefault();
    document.querySelector("#addToHomeButton").onclick = () => ev.prompt();
});
// Init.
if (location.pathname.search("play") > -1) {
    window.onload = (e) => {
        if (location.href.indexOf("localhost") > -1) {
            Settings.IsDebugEnabled = true;
        }
        else {
            Settings.IsDebugEnabled = main.Settings.IsDebugEnabled;
        }
        Settings.AreTouchControlsEnabled = main.Settings.AreTouchControlsEnabled;
        PixiHelper.LoadBackgroundEmitter();
        Sound.PlayBackground();
        Sockets.Connect();
    };
}
function gameLoop(delta) {
}
//# sourceMappingURL=Main.js.map