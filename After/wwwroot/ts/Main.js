/// <reference path="../lib/pixi-particles/ambient.d.ts" />
import Audio from "./App/Audio.js";
import Utilities from "./App/Utilities.js";
import Me from "./App/Me.js";
import WebSockets from "./App/WebSockets.js";
var after = new class {
    constructor() {
        this.Debug = false;
        this.TouchScreen = false;
        this.Audio = Audio;
        this.Me = Me;
        this.Utilities = Utilities;
        this.WebSockets = WebSockets;
    }
};
after.Renderer = new PIXI.Application({
    view: document.querySelector("#playCanvas")
});
window["After"] = after;
WebSockets.Connect();
export default after;
//# sourceMappingURL=Main.js.map