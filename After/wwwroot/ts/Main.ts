import * as Audio from "./App/Audio.js";
import * as Utilities from "./App/Utilities.js";

window.onload = (e) => {
    window["After"] = {
        Debug: false,
        TouchScreen: false,

        Audio: Audio,
        Utilities: Utilities
    }
};