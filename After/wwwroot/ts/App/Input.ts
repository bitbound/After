import { PixiHelper } from "./PixiHelper.js";
import { Main } from "../Main.js";

export const Input = new class {
    ApplyInputHandlers() {
        handleMovementJoystick();
        handleChatInput();
        handleActionJoystick();
    }
}


function handleActionJoystick() {
    var outer = document.querySelector("#actionJoystickOuter") as HTMLDivElement;
    var inner = document.querySelector("#actionJoystickInner") as HTMLDivElement;

    function moveInnerJoystick(ev: PointerEvent) {
        var wrapperRect = outer.getBoundingClientRect();
        var centerX = wrapperRect.left + (wrapperRect.width / 2);
        var centerY = wrapperRect.top + (wrapperRect.height / 2);

        var centerPoint = new PIXI.Point(centerX, centerY);
        var evPoint = new PIXI.Point(ev.x, ev.y);

        var distance = Math.min(PixiHelper.GetDistanceBetween(centerPoint, evPoint), outer.clientWidth / 2);
        var angle = PixiHelper.GetAngle(centerPoint, evPoint);
        inner.style.transform = `rotate(${angle}deg) translateX(-${distance}px)`;
    }

    function pointerMoveEvent(ev: PointerEvent) {
        moveInnerJoystick(ev);
    }
    function pointerUpEvent(ev: PointerEvent) {
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
function handleChatInput() {
    function chatBlur(e) {
        Main.UI.ChatFrame.classList.remove("chat-focus");
        Main.UI.ChatFrame.classList.add("chat-blur");
    }
    function chatFocus(e) {
        Main.UI.ChatFrame.classList.remove("chat-blur");
        Main.UI.ChatFrame.classList.add("chat-focus");
    }
    Main.UI.ChatInput.addEventListener("focus", chatFocus);
    Main.UI.ChatInput.addEventListener("blur", chatBlur);
    Main.UI.ChatChannelSelect.addEventListener("focus", chatFocus);
    Main.UI.ChatChannelSelect.addEventListener("blur", e => chatBlur);

    Main.UI.ChatInput.addEventListener("keypress", (e) => {
        if (e.key.toLowerCase() == "enter" && Main.UI.ChatInput.value.length > 0) {
            Main.Sockets.Invoke("SendChat", {
                Channel: Main.UI.ChatChannelSelect.value,
                Message: Main.UI.ChatInput.value
            });
            Main.UI.ChatInput.value = "";
        }
    });

    document.querySelector("#chatOpenCloseWrapper span").addEventListener("click", (e) => {
        if (Main.UI.ChatFrame.clientHeight <= 25) {
            Main.UI.ChatFrame.style.height = "150px";
            (e.currentTarget as HTMLElement).classList.add("glyphicon-triangle-bottom");
            (e.currentTarget as HTMLElement).classList.remove("glyphicon-triangle-top");
        }
        else {
            Main.UI.ChatFrame.style.height = "25px";
            (e.currentTarget as HTMLElement).classList.remove("glyphicon-triangle-bottom");
            (e.currentTarget as HTMLElement).classList.add("glyphicon-triangle-top");
        }
    });
}
function handleMovementJoystick() {
    var outer = document.querySelector("#moveJoystickOuter") as HTMLDivElement;
    var inner = document.querySelector("#moveJoystickInner") as HTMLDivElement;

    function moveInnerJoystick(ev: PointerEvent) {
        var wrapperRect = outer.getBoundingClientRect();
        var centerX = wrapperRect.left + (wrapperRect.width / 2);
        var centerY = wrapperRect.top + (wrapperRect.height / 2);

        var centerPoint = new PIXI.Point(centerX, centerY);
        var evPoint = new PIXI.Point(ev.x, ev.y);

        var distance = Math.min(PixiHelper.GetDistanceBetween(centerPoint, evPoint), outer.clientWidth / 2);
        var angle = PixiHelper.GetAngle(centerPoint, evPoint);
        inner.style.transform = `rotate(${angle}deg) translateX(-${distance}px)`;
    }

    function pointerMoveEvent(ev: PointerEvent) {
        moveInnerJoystick(ev);
    }
    function pointerUpEvent(ev: PointerEvent) {
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