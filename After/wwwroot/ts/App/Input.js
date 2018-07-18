import { PixiHelper } from "./PixiHelper.js";
import { Main } from "../Main.js";
export const Input = new class {
    ApplyInputHandlers() {
        handleMovementJoystick();
        handleChatInput();
        handleActionJoystick();
    }
};
function handleActionJoystick() {
    var outer = document.querySelector("#actionJoystickOuter");
    var inner = document.querySelector("#actionJoystickInner");
    var pointerID;
    function handlePointerMove(ev) {
        ev.preventDefault();
        if (ev.pointerId != pointerID) {
            return;
        }
        var wrapperRect = outer.getBoundingClientRect();
        var centerX = wrapperRect.left + (wrapperRect.width / 2);
        var centerY = wrapperRect.top + (wrapperRect.height / 2);
        var centerPoint = new PIXI.Point(centerX, centerY);
        var evPoint = new PIXI.Point(ev.x, ev.y);
        var distance = Math.min(PixiHelper.GetDistanceBetween(centerPoint, evPoint), outer.clientWidth / 2);
        var angle = PixiHelper.GetAngle(centerPoint, evPoint);
        inner.style.transform = `rotate(${angle}deg) translateX(-${distance}px)`;
    }
    function pointerUpEvent(ev) {
        ev.preventDefault();
        if (ev.pointerId != pointerID) {
            return;
        }
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", pointerUpEvent);
        inner.style.transform = "";
        inner.style.backgroundColor = "";
    }
    outer.addEventListener("pointerdown", ev => {
        ev.preventDefault();
        pointerID = ev.pointerId;
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", pointerUpEvent);
        inner.style.backgroundColor = "white";
        handlePointerMove(ev);
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
            e.currentTarget.classList.add("glyphicon-triangle-bottom");
            e.currentTarget.classList.remove("glyphicon-triangle-top");
        }
        else {
            Main.UI.ChatFrame.style.height = "25px";
            e.currentTarget.classList.remove("glyphicon-triangle-bottom");
            e.currentTarget.classList.add("glyphicon-triangle-top");
        }
    });
}
function handleMovementJoystick() {
    var outer = document.querySelector("#moveJoystickOuter");
    var inner = document.querySelector("#moveJoystickInner");
    var pointerID;
    function handlePointerMove(ev) {
        ev.preventDefault();
        if (ev.pointerId != pointerID) {
            return;
        }
        var wrapperRect = outer.getBoundingClientRect();
        var centerX = wrapperRect.left + (wrapperRect.width / 2);
        var centerY = wrapperRect.top + (wrapperRect.height / 2);
        var centerPoint = new PIXI.Point(centerX, centerY);
        var evPoint = new PIXI.Point(ev.x, ev.y);
        var distance = Math.min(PixiHelper.GetDistanceBetween(centerPoint, evPoint), outer.clientWidth / 2);
        var angle = PixiHelper.GetAngle(centerPoint, evPoint);
        inner.style.transform = `rotate(${angle}deg) translateX(-${distance}px)`;
    }
    function pointerUpEvent(ev) {
        ev.preventDefault();
        if (ev.pointerId != pointerID) {
            return;
        }
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", pointerUpEvent);
        inner.style.transform = "";
        inner.style.backgroundColor = "";
    }
    outer.addEventListener("pointerdown", ev => {
        ev.preventDefault();
        pointerID = ev.pointerId;
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", pointerUpEvent);
        inner.style.backgroundColor = "white";
        handlePointerMove(ev);
    });
}
//# sourceMappingURL=Input.js.map