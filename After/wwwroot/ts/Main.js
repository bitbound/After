/// <reference path="../lib/pixi-particles/ambient.d.ts" />
import { Sound } from "./App/Sound.js";
import { Me } from "./App/Me.js";
import { UI } from "./App/UI.js";
import { Utilities } from "./App/Utilities.js";
import { Sockets } from "./App/Sockets.js";
import { Settings } from "./App/Settings.js";
import { PixiHelper } from "./App/PixiHelper.js";
import { Input } from "./App/Input.js";
import { Renderer } from "./App/Renderer.js";
var main = new class {
    constructor() {
        this.ErrorLog = "";
        this.Input = Input;
        this.Me = Me;
        this.PixiHelper = PixiHelper;
        this.Renderer = Renderer;
        this.Sound = Sound;
        this.UI = UI;
        this.Utilities = Utilities;
        this.Settings = Settings;
        this.Sockets = Sockets;
    }
    StartGameLoop() {
        Main.Renderer.PixiApp.ticker.add(delta => gameLoop(delta));
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
        //Sound.PlayBackground();
        Sockets.Connect();
    };
}
function gameLoop(delta) {
    Main.Me.Scene.GameObjects.forEach(x => {
        if (x.Discriminator == "Character" || x.Discriminator == "PlayerCharacter") {
            if (!Main.Renderer.SceneContainer.children.some(y => y.name == x.ID)) {
                x.CreateEmitter();
            }
            else {
                x.ParticleContainer.x = (x.XCoord - Main.Me.Character.XCoord) - x.Emitter.spawnPos.x + (Main.Renderer.PixiApp.screen.width / 2);
                x.ParticleContainer.y = (x.YCoord - Main.Me.Character.YCoord) - x.Emitter.spawnPos.y + (Main.Renderer.PixiApp.screen.height / 2);
                x.ParticleContainer.children.forEach(part => {
                    part.x -= x.VelocityX * .5;
                    part.y -= x.VelocityY * .5;
                });
            }
        }
    });
    Main.Renderer.SceneContainer.children.forEach(value => {
        if (!Main.Me.Scene.GameObjects.some(go => go.ID == value.name)) {
            Main.Renderer.SceneContainer.removeChild(value);
        }
    });
}
//# sourceMappingURL=Main.js.map