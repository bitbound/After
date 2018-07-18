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
        return UI.StatsFrame.style.display == "";
    }
    set IsDebugEnabled(value: boolean) {
        if (value) {
            UI.StatsFrame.style.display = "";
        }
        else {
            UI.StatsFrame.style.display = "none";
        }
    }

    private touchscreen: boolean;
    get Touchscreen(): boolean {
        return this.touchscreen;
    }
    set Touchscreen(value: boolean) {
        this.touchscreen = value;
    }
}