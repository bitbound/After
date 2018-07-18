/// <reference path="../lib/pixi-particles/ambient.d.ts" />

import { Sound } from "./App/Sound.js";
import { Me } from "./App/Me.js";
import { Scene } from "./Models/Scene.js";
import { UI } from "./App/UI.js";
import { Utilities } from "./App/Utilities.js";
import { Sockets } from "./App/Sockets.js";
import { Settings } from "./App/Settings.js";
import { PixiHelper } from "./App/PixiHelper.js";
import { Input } from "./App/Input.js";

var main = new class {
    Input = Input;
    Me = Me;
    PixiHelper = PixiHelper;
    Renderer: PIXI.Application = new PIXI.Application({
        view: document.querySelector("#playCanvas"),
        width: 1280,
        height: 720
    });
    Scene: Scene;
    Sound = Sound;
    UI = UI;
    Utilities = Utilities;
    Settings = Settings;
    Sockets = Sockets;
    StartGameLoop() {
        Main.Renderer.ticker.add(delta => gameLoop(delta));
    }
}

window["After"] = main;
window.onload = (e) => { Sockets.Connect(); };
export const Main = main;

function gameLoop(delta) {
    if (Main.Settings.IsDebugEnabled) {
        var currentFPS = Math.round(Main.Renderer.ticker.FPS).toString();
        if (
            UI.FPSSpan.innerText != currentFPS &&
            (UI.FPSSpan.getAttribute("last-set") == null || Date.now() - parseInt(UI.FPSSpan.getAttribute("last-set")) > 1000)
        ) {
            UI.FPSSpan.innerText = currentFPS;
            UI.FPSSpan.setAttribute("last-set", Date.now().toString());
        }
    }
}