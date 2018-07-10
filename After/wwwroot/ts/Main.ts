/// <reference path="../lib/pixi-particles/ambient.d.ts" />

import Audio from "./App/Audio.js";
import Utilities from "./App/Utilities.js";
import Me from "./App/Me.js";
import WebSockets from "./App/WebSockets.js";
import Scene from "./Models/Scene.js";

var after = new class {
    Debug: boolean = false;
    TouchScreen: boolean = false;

    Audio = Audio;
    Me = Me;
    Renderer: PIXI.Application;
    Scene: Scene;
    Utilities = Utilities;
    WebSockets = WebSockets;
}

after.Renderer = new PIXI.Application({
    view: document.querySelector("#playCanvas")
});

window["After"] = after;
WebSockets.Connect();
export default after;