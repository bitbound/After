import { Utilities } from "./Utilities.js";
import { PixiHelper } from "./PixiHelper.js";
import { Input } from "./Input.js";

export const UI = new class {
    get DeubgWindow():HTMLDivElement {
        return document.querySelector("#debugWindow");
    }
    get Joystick(): HTMLDivElement {
        return document.querySelector("#joystickOuter");
    }
    get FPSSpan(): HTMLSpanElement {
        return document.querySelector("#fpsSpan");
    }
}