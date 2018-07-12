import { Utilities } from "./Utilities.js";
export const UI = new class {
    constructor() {
        applyUIEventHandlers();
    }
};
function applyUIEventHandlers() {
    handleJoystick();
}
function handleJoystick() {
    var outer = document.querySelector(".joystick-outer");
    var inner = document.querySelector(".joystick-inner");
    function moveInnerJoystick(ev) {
        var wrapperRect = outer.getBoundingClientRect();
        var centerX = wrapperRect.left + (wrapperRect.width / 2);
        var centerY = wrapperRect.top + (wrapperRect.height / 2);
        var centerPoint = new PIXI.Point(centerX, centerY);
        var evPoint = new PIXI.Point(ev.x, ev.y);
        var distance = Math.min(Utilities.GetDistanceBetween(centerPoint, evPoint), outer.clientWidth / 2);
        var angle = Utilities.GetAngle(centerPoint, evPoint);
        inner.style.transform = `rotate(${angle}deg) translateX(-${distance}px)`;
    }
    function pointerMoveEvent(ev) {
        moveInnerJoystick(ev);
    }
    function pointerUpEvent(ev) {
        window.removeEventListener("pointermove", pointerMoveEvent);
        window.removeEventListener("pointerup", pointerUpEvent);
        inner.style.transform = "";
        inner.style.backgroundColor = "";
    }
    outer.addEventListener("pointerdown", ev => {
        window.addEventListener("pointermove", pointerMoveEvent);
        window.addEventListener("pointerup", pointerUpEvent);
        inner.style.backgroundColor = "white";
        moveInnerJoystick(ev);
    });
}
//# sourceMappingURL=UI.js.map