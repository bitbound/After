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
    ErrorLog: string = "";
    Input = Input;
    Me = Me;
    PixiHelper = PixiHelper;
    Renderer: PIXI.Application = new PIXI.Application({
        view: document.querySelector("#playCanvas"),
        width: Settings.RendererResolution.Width,
        height: Settings.RendererResolution.Height
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

window.onerror = (ev: Event, source, fileNo, columnNo, error: Error) => {
    var errorMessage = `${new Date().toLocaleString()}  |  File: ${fileNo}  |  Column: ${columnNo}  |  Message: ${error.message}  |  Stack: ${error.stack}`.replace("\r\n", "<br>");
    main.ErrorLog += errorMessage + "<br><br>";
};

window["After"] = main;
export const Main = main;

// Register service worker.
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/ts/Worker.js', {scope: "/ts/"})
        .then(function (reg) {
            console.log("Service worker registered.");
        }).catch(function (err) {
            console.log("Error registering service worker:", err)
        });
}

// Catch add to home prompt.
window.addEventListener("beforeinstallprompt", (ev:any) => {
    ev.preventDefault();
    (document.querySelector("#addToHomeButton") as HTMLSpanElement).onclick = () => ev.prompt();
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
        Sound.Play("/Assets/Sounds/ceich93__drone-darkemptiness.mp3", true);
        Sockets.Connect();
    };
}

function gameLoop(delta) {
   
}