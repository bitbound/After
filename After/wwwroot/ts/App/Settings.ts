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
        return UI.DebugFrame.style.display == "";
    }
    set IsDebugEnabled(value: boolean) {
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
    }

    private areTouchControlsEnabled: boolean;
    get AreTouchControlsEnabled(): boolean {
        return this.areTouchControlsEnabled;
    }
    set AreTouchControlsEnabled(value: boolean) {
        this.areTouchControlsEnabled = value;
        if (value) {
            (document.querySelector("#movementTouchArea") as HTMLElement).hidden = false;
            (document.querySelector("#actionTouchArea") as HTMLElement).hidden = false;
        } else {
            (document.querySelector("#movementTouchArea") as HTMLElement).hidden = true;
            (document.querySelector("#actionTouchArea") as HTMLElement).hidden = true;
        }
    }
}