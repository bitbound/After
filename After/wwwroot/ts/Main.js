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
window.onerror = (ev, source, fileNo, columnNo, error) => {
    var errorMessage = `${new Date().toLocaleString()}  |  File: ${fileNo}  |  Column: ${columnNo}  |  Message: ${error.message}  |  Stack: ${error.stack}`.replace("\r\n", "<br>");
    main.ErrorLog += errorMessage + "<br><br>";
};
window["After"] = main;
export const Main = main;
if (location.pathname.search("play") > -1) {
    window.onload = (e) => { Sockets.Connect(); };
}
function gameLoop(delta) {
}
//# sourceMappingURL=Main.js.map