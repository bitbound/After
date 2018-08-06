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
    Init(currentCharacter:Character, rendererWidth:number, rendererHeight:number) {
        UI.AddSystemMessage("Welcome to After.");
        UI.ApplyDataBinds();
        this.Renderer.CreatePixiApp(rendererWidth, rendererHeight);
        Input.ApplyInputHandlers();
        if (location.href.indexOf("localhost") > -1) {
            Settings.IsDebugEnabled = true;
        }
        else {
            Settings.IsDebugEnabled = Settings.IsDebugEnabled;
        }

        Settings.AreTouchControlsEnabled = Settings.AreTouchControlsEnabled;
        PixiHelper.LoadBackgroundEmitter();
        $.extend(true, this.Me.Character, currentCharacter);
        UI.UpdateStatBars();
        this.Me.Character.CreateEmitter();
        this.StartGameLoop();
    }
}

window.onerror = (ev: Event, source, fileNo, columnNo, error: Error) => {
    var errorMessage = `${new Date().toLocaleString()}  |  File: ${fileNo}  |  Column: ${columnNo}  |  Message: ${error.message}  |  Stack: ${error.stack}`.replace("\r\n", "<br>");
    main.ErrorLog += errorMessage + "<br><br>";
};

window["After"] = main;
export const Main = main;



// Initial connect.
if (location.pathname.search("play") > -1) {
    window.onload = (e) => {
        // Register service worker.
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/ts/Worker.js', { scope: "/ts/" })
                .then(function (reg) {
                    console.log("Service worker registered.");
                }).catch(function (err) {
                    console.log("Error registering service worker:", err)
                });
        }

        // Catch add to home prompt.
        window.addEventListener("beforeinstallprompt", (ev: any) => {
            ev.preventDefault();
            (document.querySelector("#addToHomeButton") as HTMLSpanElement).onclick = () => ev.prompt();
        });

        window.addEventListener("beforeunload", ev => {
            if (location.href.indexOf("localhost") == -1) {
                ev.returnValue = "Are you sure you want to exit?";
            }
        })
        Sockets.Connect();
    };
}

function gameLoop(delta) {
    Main.Me.Character.ParticleContainer.children.forEach(part => {
        part.x -= Main.Me.Character.VelocityX * .5;
        part.y -= Main.Me.Character.VelocityY * .5;
    });
    Main.Renderer.BackgroundParticleContainer.children.forEach(part => {
        part.x -= Main.Me.Character.VelocityX * .25;
        part.y -= Main.Me.Character.VelocityY * .25;
    });
    Main.Me.Scene.GameObjects.forEach(x => {
        switch (x.Discriminator) {
            case "Character":
            case "PlayerCharacter":
                if (!Main.Renderer.SceneContainer.children.some(y => y.name == x.ID)) {
                    (x as Character).CreateEmitter();
                }
                else {
                    var targetX = (x.XCoord - Main.Me.Character.XCoord) + (Main.Renderer.PixiApp.screen.width / 2);
                    var targetY = (x.YCoord - Main.Me.Character.YCoord) + (Main.Renderer.PixiApp.screen.height / 2);
                    var fromX = (x as Character).ParticleContainer.x;
                    var fromY = (x as Character).ParticleContainer.y;
                    if (targetX != fromX) {
                        Utilities.Animate((x as Character).ParticleContainer, "x", null, targetX, null, 20, 1);
                    }
                    if (targetY != fromY) {
                        Utilities.Animate((x as Character).ParticleContainer, "y", null, targetY, null, 20, 1);
                    }
                    (x as Character).ParticleContainer.children.forEach(part => {
                        part.x -= x.VelocityX * .5;
                        part.y -= x.VelocityY * .5;
                    })
                }
                break;
            case "Projectile":
                if (!Main.Renderer.SceneContainer.children.some(y => y.name == x.ID)) {
                    var projectile = new PIXI.Graphics();
                    // TODO:
                }
                else {
                    var targetX = (x.XCoord - Main.Me.Character.XCoord) + (Main.Renderer.PixiApp.screen.width / 2);
                    var targetY = (x.YCoord - Main.Me.Character.YCoord) + (Main.Renderer.PixiApp.screen.height / 2);
                    var fromX = (x as Character).ParticleContainer.x;
                    var fromY = (x as Character).ParticleContainer.y;
                    if (targetX != fromX) {
                        Utilities.Animate((x as Character).ParticleContainer, "x", null, targetX, null, 20, 1);
                    }
                    if (targetY != fromY) {
                        Utilities.Animate((x as Character).ParticleContainer, "y", null, targetY, null, 20, 1);
                    }
                    (x as Character).ParticleContainer.children.forEach(part => {
                        part.x -= x.VelocityX * .5;
                        part.y -= x.VelocityY * .5;
                    })
                }
                break;
            default:
                break;
        }
    });
    Main.Renderer.SceneContainer.children.forEach( value => {
        if (!Main.Me.Scene.GameObjects.some(go => go.ID == value.name)) {
            Main.Renderer.SceneContainer.removeChild(value);
        }
    });
}