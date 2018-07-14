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
        return UI.DebugWindow.hidden;
    }
    set IsDebugEnabled(value: boolean) {
        UI.DebugWindow.hidden = value;
    }

    private touchscreen: boolean;
    get Touchscreen(): boolean {
        return this.touchscreen;
    }
    set Touchscreen(value: boolean) {
        this.touchscreen = value;
    }
}