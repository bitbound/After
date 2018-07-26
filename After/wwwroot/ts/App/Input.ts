import { PixiHelper } from "./PixiHelper.js";
import { Main } from "../Main.js";
import { UI } from "./UI.js";
import { Utilities } from "./Utilities.js";
import { Me } from "./Me.js";
import { Sockets } from "./Sockets.js";
import { Settings } from "./Settings.js";

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
        handleAddToHomeButtonClick();
        handleDebugFrame();
    }
}
function handleDebugFrame() {
    document.querySelector("#jsErrorsLink").addEventListener("click", ev => {
        UI.ShowModal("Error Log", Main.ErrorLog);
    })
}
function handleAddToHomeButtonClick() {
    document.querySelector("#addToHomeButton").addEventListener("click", ev => {
        UI.ShowModal("Add to Home Screen", `
            You can install this web app to your mobile device for a native-app-like feel!<br><br>
            From your mobile device, use your browser's Add to Home Screen feature to create a shortcut on your home screen.
            When you launch After from that shortcut, it will open and run like a normal app.`);
    });
}
function handleMenuOptionsButtons() {
    document.querySelector("#buttonFullscreen").addEventListener("click", ev => {
        if (document.documentElement.requestFullscreen) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            else {
                document.documentElement.requestFullscreen();
            }
        }
        else if ((document.documentElement as any).mozRequestFullScreen) {
            if ((document as any).mozFullScreen) {
                (document as any).mozCancelFullScreen();
            }
            else {
                (document.documentElement as any).mozRequestFullScreen();
            }
        }
        else if (document.documentElement.webkitRequestFullScreen) {
            if (document.webkitIsFullScreen) {
                document.webkitExitFullscreen();
            }
            else {
                document.documentElement.webkitRequestFullScreen();
            }
        }
    });
    document.querySelector("#toggleDebugWindow").addEventListener("click", ev => {
        Settings.IsDebugEnabled = !Settings.IsDebugEnabled;
        (ev.currentTarget as HTMLElement).setAttribute("on", String(Settings.IsDebugEnabled));
    });
    document.querySelector("#logoutButton").addEventListener("click", ev => {
        Sockets.IsDisconnectExpected = true;
        Sockets.Connection.stop();
    });
    document.querySelector("#toggleTouchControls").addEventListener("click", ev => {
        Settings.AreTouchControlsEnabled = !Settings.AreTouchControlsEnabled;
        (ev.currentTarget as HTMLElement).setAttribute("on", String(Settings.AreTouchControlsEnabled));
    });
}
function handleActionJoystick() {
    var outer = document.querySelector("#actionJoystickOuter") as HTMLDivElement;
    var inner = document.querySelector("#actionJoystickInner") as HTMLDivElement;
    var pointerID;

    function actionMove(ev: PointerEvent) {
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

    function actionUp(ev: PointerEvent) {
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
    var outer = document.querySelector("#moveJoystickOuter") as HTMLDivElement;
    var inner = document.querySelector("#moveJoystickInner") as HTMLDivElement;
    var pointerID;

    function movementMove(ev: PointerEvent) {
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

    function movementUp(ev: PointerEvent) {
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
    document.querySelector("#chatResizeBar").addEventListener("pointerdown", (ev: PointerEvent) => {
        var pointerID = ev.pointerId;
        var preventClick = false;
        var startY = ev.y;
        var startHeight = UI.ChatFrame.clientHeight;

        function pointerMove(ev: PointerEvent) {
            if (ev.pointerId != pointerID) {
                return;
            }
            ev.preventDefault();
            if (Math.abs(startY - ev.y) > 5) {
                preventClick = true;
            }
            UI.ChatFrame.style.height = String(Math.max(35, startHeight + startY - Math.max(0, ev.y))) + "px";
        };
        function pointerUp(ev: PointerEvent) {
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
    document.querySelector("#menuButton").addEventListener("pointerdown", (ev: PointerEvent) => {
        var button = document.querySelector("#menuButton") as HTMLSpanElement;
        var wrapper = document.querySelector("#menuWrapper") as HTMLDivElement;
        var pointerID = ev.pointerId;
        var preventClick = false;
        var startX = ev.x;
        var startWidth = wrapper.clientWidth;

        function pointerMove(ev: PointerEvent) {
            if (ev.pointerId != pointerID) {
                return;
            }
            ev.preventDefault();

            if (Math.abs(startX - ev.x) > 5) {
                preventClick = true;
            }

            wrapper.style.width = String(Math.max(30, startWidth + startX - Math.max(0, ev.x))) + "px";

            wrapper.style.height = "auto";
            wrapper.style.overflow = "auto";
          
        }
        function pointerUp(ev: PointerEvent) {
            if (ev.pointerId != pointerID) {
                return;
            }
            window.removeEventListener("pointermove", pointerMove);
            window.removeEventListener("pointerup", pointerUp);
            if (!preventClick) {
                if (wrapper.clientWidth <= 35) {
                    Utilities.Animate(wrapper.style, "width", wrapper.clientWidth, 200, "px", 200);
                    wrapper.style.height = "auto";
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
    })
}

function handleMenuHeaderClick() {
    document.querySelectorAll("#menuWrapper .menu-section-header").forEach((value, index) => {
        value.addEventListener("click", ev => {
            (ev.currentTarget as HTMLElement).nextElementSibling.classList.toggle("menu-body-closed");
        })
    });
}