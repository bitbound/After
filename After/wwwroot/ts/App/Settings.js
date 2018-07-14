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
        return UI.DebugWindow.hidden;
    }
    set IsDebugEnabled(value) {
        UI.DebugWindow.hidden = value;
    }
    get Touchscreen() {
        return this.touchscreen;
    }
    set Touchscreen(value) {
        this.touchscreen = value;
    }
};
//# sourceMappingURL=Settings.js.map