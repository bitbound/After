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
import { Character } from "./Models/Character.js";

var main = new class {
    ErrorLog: string = "";
    Input = Input;
    Me = Me;
    PixiHelper = PixiHelper;
    Renderer = Renderer;
    Sound = Sound;
    UI = UI;
    Utilities = Utilities;
    Settings = Settings;
    Sockets = Sockets;
    StartGameLoop() {
        Main.Renderer.PixiApp.ticker.add(delta => gameLoop(delta));
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
        //Sound.PlayBackground();
        Sockets.Connect();
    };
}

function gameLoop(delta) {
    Main.Me.Scene.GameObjects.forEach(x => {
        if (x.Discriminator == "Character" || x.Discriminator == "PlayerCharacter") {
            if (!Main.Renderer.SceneContainer.children.some(y => y.name == x.ID)) {
                (x as Character).CreateEmitter();
            }
            else {
                (x as Character).ParticleContainer.x = (x.XCoord - Main.Me.Character.XCoord) - (x as Character).Emitter.spawnPos.x + (Main.Renderer.PixiApp.screen.width / 2);
                (x as Character).ParticleContainer.y = (x.YCoord - Main.Me.Character.YCoord) - (x as Character).Emitter.spawnPos.y + (Main.Renderer.PixiApp.screen.height / 2);
                (x as Character).ParticleContainer.children.forEach(part => {
                    part.x -= x.VelocityX * .5;
                    part.y -= x.VelocityY * .5;
                })
            }
        }
    });
    Main.Renderer.SceneContainer.children.forEach( value => {
        if (!Main.Me.Scene.GameObjects.some(go => go.ID == value.name)) {
            Main.Renderer.SceneContainer.removeChild(value);
        }
    });
}