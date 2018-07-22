import { PixiHelper } from "./PixiHelper.js";
import { Main } from "../Main.js";
import { UI } from "./UI.js";
import { Utilities } from "./Utilities.js";
export const Input = new class {
    ApplyInputHandlers() {
        handleMovementJoystick();
        handleChatBlurFocus();
        handleChatResize();
        handleChatTextInput();
        handleActionJoystick();
        handleMenuButton();
        handleMenuHeaderClick();
        handleMenuOptionsButtons();
    }
};
function handleMenuOptionsButtons() {
    document.querySelector("#buttonFullscreen").addEventListener("click", ev => {
        if (document.body.requestFullscreen) {
            if (document.fullscreenElement) {
                document.body.requestFullscreen();
            }
            else {
                document.exitFullscreen();
            }
        }
        else if (document.body.mozRequestFullScreen) {
            if (document.mozFullScreen) {
                document.mozCancelFullScreen();
            }
            else {
                document.body.mozRequestFullScreen();
            }
        }
        else if (document.body.webkitRequestFullScreen) {
            if (document.webkitIsFullScreen) {
                document.webkitExitFullscreen();
            }
            else {
                document.body.webkitRequestFullScreen();
            }
        }
    });
}
function handleActionJoystick() {
    var outer = document.querySelector("#actionJoystickOuter");
    var inner = document.querySelector("#actionJoystickInner");
    var pointerID;
    function actionMove(ev) {
        if (ev.pointerId != pointerID) {
            return;
        }
        ev.preventDefault();
        var wrapperRect = outer.getBoundingClientRect();
        var centerX = wrapperRect.left + (wrapperRect.width / 2);
        var centerY = wrapperRect.top + (wrapperRect.height / 2);
        var centerPoint = new PIXI.Point(centerX, centerY);
        var evPoint = new PIXI.Point(ev.x, ev.y);
        var distance = Math.min(PixiHelper.GetDistanceBetween(centerPoint, evPoint), outer.clientWidth / 2);
        var angle = PixiHelper.GetAngle(centerPoint, evPoint);
        inner.style.transform = `rotate(${angle}deg) translateX(-${distance}px)`;
    }
    function actionUp(ev) {
        if (ev.pointerId != pointerID) {
            return;
        }
        ev.preventDefault();
        window.removeEventListener("pointermove", actionMove);
        window.removeEventListener("pointerup", actionUp);
        inner.style.transform = "";
        inner.style.backgroundColor = "";
    }
    outer.addEventListener("pointerdown", ev => {
        ev.preventDefault();
        pointerID = ev.pointerId;
        window.addEventListener("pointermove", actionMove);
        window.addEventListener("pointerup", actionUp);
        inner.style.backgroundColor = "white";
        actionMove(ev);
    });
}
function handleMovementJoystick() {
    var outer = document.querySelector("#moveJoystickOuter");
    var inner = document.querySelector("#moveJoystickInner");
    var pointerID;
    function movementMove(ev) {
        if (ev.pointerId != pointerID) {
            return;
        }
        ev.preventDefault();
        var wrapperRect = outer.getBoundingClientRect();
        var centerX = wrapperRect.left + (wrapperRect.width / 2);
        var centerY = wrapperRect.top + (wrapperRect.height / 2);
        var centerPoint = new PIXI.Point(centerX, centerY);
        var evPoint = new PIXI.Point(ev.x, ev.y);
        var distance = Math.min(PixiHelper.GetDistanceBetween(centerPoint, evPoint), outer.clientWidth / 2);
        var angle = PixiHelper.GetAngle(centerPoint, evPoint);
        inner.style.transform = `rotate(${angle}deg) translateX(-${distance}px)`;
    }
    function movementUp(ev) {
        if (ev.pointerId != pointerID) {
            return;
        }
        ev.preventDefault();
        window.removeEventListener("pointermove", movementMove);
        window.removeEventListener("pointerup", movementUp);
        inner.style.transform = "";
        inner.style.backgroundColor = "";
    }
    outer.addEventListener("pointerdown", ev => {
        ev.preventDefault();
        pointerID = ev.pointerId;
        window.addEventListener("pointermove", movementMove);
        window.addEventListener("pointerup", movementUp);
        inner.style.backgroundColor = "white";
        movementMove(ev);
    });
}
function handleChatBlurFocus() {
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
    Main.UI.ChatChannelSelect.addEventListener("blur", chatBlur);
    UI.ChatMessages.addEventListener("click", (e) => {
        Main.UI.ChatFrame.classList.toggle("chat-blur");
        Main.UI.ChatFrame.classList.toggle("chat-focus");
    });
}
function handleChatTextInput() {
    Main.UI.ChatInput.addEventListener("keypress", (e) => {
        if (e.key.toLowerCase() == "enter" && Main.UI.ChatInput.value.length > 0) {
            Main.Sockets.Invoke("SendChat", {
                Channel: Main.UI.ChatChannelSelect.value,
                Message: Main.UI.ChatInput.value
            });
            Main.UI.ChatInput.value = "";
        }
    });
}
function handleChatResize() {
    document.querySelector("#chatOpenCloseWrapper").addEventListener("pointerdown", (ev) => {
        var pointerID = ev.pointerId;
        var preventClick = false;
        var startY = ev.y;
        var startHeight = UI.ChatFrame.clientHeight;
        function pointerMove(ev) {
            if (ev.pointerId != pointerID) {
                return;
            }
            ev.preventDefault();
            if (Math.abs(startY - ev.y) > 5) {
                preventClick = true;
            }
            UI.ChatFrame.style.height = String(Math.max(35, startHeight + startY - Math.max(0, ev.y))) + "px";
        }
        ;
        function pointerUp(ev) {
            if (ev.pointerId != pointerID) {
                return;
            }
            window.removeEventListener("pointerup", pointerUp);
            window.removeEventListener("pointermove", pointerMove);
            if (!preventClick) {
                if (Main.UI.ChatFrame.clientHeight <= 35) {
                    Utilities.Animate(UI.ChatFrame.style, "height", UI.ChatFrame.clientHeight, 150, "px", 200);
                }
                else {
                    Utilities.Animate(UI.ChatFrame.style, "height", UI.ChatFrame.clientHeight, 35, "px", 200);
                }
            }
        }
        window.addEventListener("pointermove", pointerMove);
        window.addEventListener("pointerup", pointerUp);
    });
}
function handleMenuButton() {
    document.querySelector("#menuButton").addEventListener("pointerdown", (ev) => {
        var button = document.querySelector("#menuButton");
        var wrapper = document.querySelector("#menuWrapper");
        var pointerID = ev.pointerId;
        var preventClick = false;
        var startX = ev.x;
        var startWidth = wrapper.clientWidth;
        function pointerMove(ev) {
            if (ev.pointerId != pointerID) {
                return;
            }
            ev.preventDefault();
            if (Math.abs(startX - ev.x) > 5) {
                preventClick = true;
            }
            wrapper.style.width = String(Math.max(30, startWidth + startX - Math.max(0, ev.x))) + "px";
            wrapper.style.height = null;
            wrapper.style.overflow = "auto";
        }
        function pointerUp(ev) {
            if (ev.pointerId != pointerID) {
                return;
            }
            window.removeEventListener("pointermove", pointerMove);
            window.removeEventListener("pointerup", pointerUp);
            if (!preventClick) {
                if (wrapper.clientWidth <= 35) {
                    Utilities.Animate(wrapper.style, "width", wrapper.clientWidth, 200, "px", 200);
                    wrapper.style.height = null;
                    wrapper.style.overflow = "auto";
                }
                else {
                    Utilities.Animate(wrapper.style, "width", wrapper.clientWidth, 35, "px", 200);
                    Utilities.Animate(wrapper.style, "height", wrapper.clientHeight, 35, "px", 200);
                    wrapper.style.overflow = "hidden";
                }
            }
        }
        window.addEventListener("pointermove", pointerMove);
        window.addEventListener("pointerup", pointerUp);
    });
}
function handleMenuHeaderClick() {
    document.querySelectorAll("#menuWrapper .menu-header").forEach((value, index) => {
        value.addEventListener("click", ev => {
            ev.currentTarget.nextElementSibling.classList.toggle("menu-body-closed");
        });
    });
}
//# sourceMappingURL=Input.js.map