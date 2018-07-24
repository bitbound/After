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
        return UI.StatsFrame.style.display == "";
    }
    set IsDebugEnabled(value) {
        if (value) {
            UI.StatsFrame.style.display = "";
        }
        else {
            UI.StatsFrame.style.display = "none";
        }
    }
    get AreTouchControlsEnabled() {
        return this.areTouchControlsEnabled;
    }
    set AreTouchControlsEnabled(value) {
        this.areTouchControlsEnabled = value;
        if (value) {
            // TODO
        }
        else {
        }
    }
};
//# sourceMappingURL=Settings.js.map