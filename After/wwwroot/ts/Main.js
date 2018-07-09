/// <reference path="../lib/pixi-particles/ambient.d.ts" />
import Audio from "./App/Audio.js";
import Utilities from "./App/Utilities.js";
import Me from "./App/Me.js";
var after = new class {
    constructor() {
        this.Debug = false;
        this.TouchScreen = false;
        this.Audio = Audio;
        this.Me = Me;
        this.Utilities = Utilities;
    }
};
function createRenderer() {
    after.Renderer = new PIXI.Application({
        view: document.querySelector("#playCanvas"),
        transparent: true
    });
    Me.Create(after.Renderer);
}
createRenderer();
window["After"] = after;
export default after;
//# sourceMappingURL=Main.js.map