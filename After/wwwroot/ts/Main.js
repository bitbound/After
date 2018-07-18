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
        this.Input = Input;
        this.Me = Me;
        this.PixiHelper = PixiHelper;
        this.Renderer = new PIXI.Application({
            view: document.querySelector("#playCanvas"),
            width: 1280,
            height: 720
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
window["After"] = main;
window.onload = (e) => { Sockets.Connect(); };
export const Main = main;
function gameLoop(delta) {
    if (Main.Settings.IsDebugEnabled) {
        var currentFPS = Math.round(Main.Renderer.ticker.FPS).toString();
        if (UI.FPSSpan.innerText != currentFPS &&
            (UI.FPSSpan.getAttribute("last-set") == null || Date.now() - parseInt(UI.FPSSpan.getAttribute("last-set")) > 1000)) {
            UI.FPSSpan.innerText = currentFPS;
            UI.FPSSpan.setAttribute("last-set", Date.now().toString());
        }
    }
}
//# sourceMappingURL=Main.js.map