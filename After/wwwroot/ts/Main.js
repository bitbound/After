/// <reference path="../lib/pixi-particles/ambient.d.ts" />
import { Sound } from "./App/Sound.js";
import { Me } from "./App/Me.js";
import { UI } from "./App/UI.js";
import { Utilities } from "./App/Utilities.js";
import { Sockets } from "./App/Sockets.js";
const After = new class {
    constructor() {
        this.Debug = false;
        this.TouchScreen = false;
        this.Me = Me;
        this.Sound = Sound;
        this.UI = UI;
        this.Utilities = Utilities;
        this.Sockets = Sockets;
    }
};
function init() {
    if (location.href.indexOf("localhost") > -1) {
        After.Debug = true;
    }
    After.Renderer = new PIXI.Application({
        view: document.querySelector("#playCanvas"),
        width: 1280,
        height: 720
    });
    After.Renderer.ticker.add(delta => gameLoop(delta));
    window["After"] = After;
    Sockets.Connect();
}
function gameLoop(delta) {
    if (After.Debug) {
    }
}
init();
export default After;
//# sourceMappingURL=Main.js.map