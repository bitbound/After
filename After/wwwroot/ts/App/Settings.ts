import { Main } from "../Main.js";
import { UI } from "./UI.js";

export const Settings = new class {
    Colors = {
        GlobalChat: "rgb(0, 255, 64)",
        VoidChat: "rgb(0, 220, 255)",
        Whisper: "magenta",
        SystemMessage: "lightgray",
        DebugMessage: "rgb(150,50,50)"
    };
    get IsDebugEnabled(): boolean {
        return localStorage["IsDebugEnabled"] == 'true';
    }
    set IsDebugEnabled(value: boolean) {
        localStorage["IsDebugEnabled"] = value;
        var fpsUpdateTicker = (delta => {
            var currentFPS = Math.round(Main.Renderer.ticker.FPS).toString();
            if (
                UI.FPSSpan.innerText != currentFPS &&
                (UI.FPSSpan.getAttribute("last-set") == null || Date.now() - parseInt(UI.FPSSpan.getAttribute("last-set")) > 1000)
            ) {
                UI.FPSSpan.innerText = currentFPS;
                UI.FPSSpan.setAttribute("last-set", Date.now().toString());
            }
        });
        if (value) {
            Main.Renderer.ticker.add(fpsUpdateTicker);
            UI.DebugFrame.style.display = "";
        }
        else {
            Main.Renderer.ticker.remove(fpsUpdateTicker);
            UI.DebugFrame.style.display = "none";
        }
        document.querySelector("#toggleDebugWindow").setAttribute("on", String(value));
    }

    get AreTouchControlsEnabled(): boolean {
        if (localStorage["AreTouchControlsEnabled"] == undefined) {
            localStorage["AreTouchControlsEnabled"] = 'true';
        }
        return localStorage["AreTouchControlsEnabled"] == 'true';
    }
    set AreTouchControlsEnabled(value: boolean) {
        localStorage["AreTouchControlsEnabled"] = value;
        if (value) {
            (document.querySelector("#movementTouchArea") as HTMLElement).hidden = false;
            (document.querySelector("#actionTouchArea") as HTMLElement).hidden = false;
        } else {
            (document.querySelector("#movementTouchArea") as HTMLElement).hidden = true;
            (document.querySelector("#actionTouchArea") as HTMLElement).hidden = true;
        }
        document.querySelector("#toggleTouchControls").setAttribute("on", String(value));
    }
    RendererResolution = {
        Width: 1280,
        Height: 720
    }
}