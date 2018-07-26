import { Main } from "../Main.js";
import { UI } from "./UI.js";
export const Settings = new class {
    constructor() {
        this.Colors = {
            GlobalChat: "rgb(0, 255, 64)",
            VoidChat: "rgb(0, 220, 255)",
            Whisper: "magenta",
            SystemMessage: "lightgray",
            DebugMessage: "rgb(150,50,50)"
        };
    }
    get IsDebugEnabled() {
        return UI.DebugFrame.style.display == "";
    }
    set IsDebugEnabled(value) {
        var fpsUpdateTicker = (delta => {
            var currentFPS = Math.round(Main.Renderer.ticker.FPS).toString();
            if (UI.FPSSpan.innerText != currentFPS &&
                (UI.FPSSpan.getAttribute("last-set") == null || Date.now() - parseInt(UI.FPSSpan.getAttribute("last-set")) > 1000)) {
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
    get AreTouchControlsEnabled() {
        return this.areTouchControlsEnabled;
    }
    set AreTouchControlsEnabled(value) {
        this.areTouchControlsEnabled = value;
        if (value) {
            document.querySelector("#movementTouchArea").hidden = false;
            document.querySelector("#actionTouchArea").hidden = false;
        }
        else {
            document.querySelector("#movementTouchArea").hidden = true;
            document.querySelector("#actionTouchArea").hidden = true;
        }
    }
};
//# sourceMappingURL=Settings.js.map