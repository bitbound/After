import { PixiHelper } from "./PixiHelper.js";
import { Main } from "../Main.js";
import { UI } from "./UI.js";
import { Utilities } from "./Utilities.js";
import { Sockets } from "./Sockets.js";
import { Settings } from "./Settings.js";
export const Input = new class {
    constructor() {
        this.LastMovementSent = Date.now();
        this.InputKeyStates = {
            Up: false,
            Right: false,
            Down: false,
            Left: false,
            Charge: false
        };
    }
    ApplyInputHandlers() {
        handleMovementJoystick();
        handleKeyboardInput();
        handleChatBlurFocus();
        handleChatResize();
        handleChatTextInput();
        handleActionJoystick();
        handleMenuButton();
        handleMenuHeaderClick();
        handleMenuOptionsButtons();
        handleAddToHomeButtonClick();
        handleDebugFrame();
        handleCanvasPointerInput();
    }
    ;
    QueueMovementStateUpdate(methodName, args) {
        var waitRequired = 100 - Date.now() + this.LastMovementSent;
        window.clearTimeout(this.SendMovementTimeout);
        if (waitRequired <= 0) {
            this.LastMovementSent = Date.now();
            Sockets.Invoke(methodName, args);
        }
        else {
            this.SendMovementTimeout = window.setTimeout(() => {
                this.LastMovementSent = Date.now();
                Sockets.Invoke(methodName, args);
            }, waitRequired);
        }
    }
    ;
};
function addAimingPointer(centerPoint, targetPoint) {
    if (!Main.Renderer.PixiApp.stage.children.some(x => x.name == "Aiming Pointer")) {
        var pointerGraphic = new PIXI.Graphics();
        pointerGraphic.x = Main.Renderer.PixiApp.screen.width / 2;
        pointerGraphic.y = Main.Renderer.PixiApp.screen.height / 2;
        pointerGraphic.name = "Aiming Pointer";
        pointerGraphic.lineStyle(2, PIXI.utils.rgb2hex([1, 1, 1]));
        pointerGraphic.moveTo(-30, 0);
        pointerGraphic.lineTo(-150, 0);
        pointerGraphic.rotation = PixiHelper.GetAngleInRadians(centerPoint, targetPoint);
        Main.Renderer.PixiApp.stage.addChild(pointerGraphic);
    }
}
function handleActionJoystick() {
    var outer = document.querySelector("#actionJoystickOuter");
    var inner = document.querySelector("#actionJoystickInner");
    var pointerID;
    function actionMove(ev) {
        if (ev.pointerId != pointerID) {
            return;
        }
        ev.stopPropagation();
        var wrapperRect = outer.getBoundingClientRect();
        var centerX = wrapperRect.left + (wrapperRect.width / 2);
        var centerY = wrapperRect.top + (wrapperRect.height / 2);
        var centerPoint = new PIXI.Point(centerX, centerY);
        var evPoint = new PIXI.Point(ev.x, ev.y);
        var distance = Math.min(PixiHelper.GetDistanceBetween(centerPoint, evPoint), outer.clientWidth / 2);
        var angle = PixiHelper.GetAngleInDegrees(centerPoint, evPoint);
        inner.style.transform = `rotate(${angle}deg) translateX(-${distance}px)`;
        rotateAimingPointer(centerPoint, evPoint);
    }
    function actionUp(ev) {
        if (ev.pointerId != pointerID) {
            return;
        }
        ev.stopPropagation();
        var wrapperRect = outer.getBoundingClientRect();
        var centerX = wrapperRect.left + (wrapperRect.width / 2);
        var centerY = wrapperRect.top + (wrapperRect.height / 2);
        var centerPoint = new PIXI.Point(centerX, centerY);
        var targetPoint = new PIXI.Point(ev.x, ev.y);
        var angle = PixiHelper.GetAngleInDegrees(centerPoint, targetPoint);
        Sockets.Invoke("ReleaseCharging", { Angle: angle });
        window.removeEventListener("pointermove", actionMove);
        window.removeEventListener("pointerup", actionUp);
        inner.style.transform = "";
        inner.style.backgroundColor = "";
        removeAimingPointer();
    }
    outer.addEventListener("pointerdown", ev => {
        ev.stopPropagation();
        pointerID = ev.pointerId;
        Sockets.Invoke("BeginCharging", null);
        window.addEventListener("pointermove", actionMove);
        window.addEventListener("pointerup", actionUp);
        inner.style.backgroundColor = "white";
        var wrapperRect = outer.getBoundingClientRect();
        var centerX = wrapperRect.left + (wrapperRect.width / 2);
        var centerY = wrapperRect.top + (wrapperRect.height / 2);
        var centerPoint = new PIXI.Point(centerX, centerY);
        var evPoint = new PIXI.Point(ev.x, ev.y);
        addAimingPointer(centerPoint, evPoint);
        actionMove(ev);
    });
}
function handleAddToHomeButtonClick() {
    document.querySelector("#addToHomeButton").addEventListener("click", ev => {
        UI.ShowModal("Add to Home Screen", `
            You can install this web app to your mobile device to make it feel like a native app!<br><br>
            From your mobile device, use your browser's Add to Home Screen feature to create a shortcut on your home screen.
            When you launch After from that shortcut, it will open and run like a normal app.`);
    });
}
function handleCanvasPointerInput() {
    window.addEventListener("blur", e => {
        removeAimingPointer();
    });
    Main.Renderer.PixiApp.view.addEventListener("pointerdown", e => {
        Sockets.Invoke("BeginCharging", null);
        var centerPoint = Utilities.GetCenterPoint(e);
        var targetPoint = new PIXI.Point(e.x, e.y);
        addAimingPointer(centerPoint, targetPoint);
        rotateAimingPointer(centerPoint, targetPoint);
    });
    Main.Renderer.PixiApp.view.addEventListener("pointerup", (e) => {
        var centerPoint = Utilities.GetCenterPoint(e);
        var targetPoint = new PIXI.Point(e.x, e.y);
        var angle = PixiHelper.GetAngleInDegrees(centerPoint, targetPoint);
        Sockets.Invoke("ReleaseCharging", { Angle: angle });
        if (e.pointerType == "touch" || e.pointerType == "pen") {
            removeAimingPointer();
        }
    });
    Main.Renderer.PixiApp.view.addEventListener("mouseover", e => {
        var centerPoint = Utilities.GetCenterPoint(e);
        var targetPoint = new PIXI.Point(e.x, e.y);
        addAimingPointer(centerPoint, targetPoint);
        rotateAimingPointer(centerPoint, targetPoint);
    });
    Main.Renderer.PixiApp.view.addEventListener("pointermove", e => {
        var centerPoint = Utilities.GetCenterPoint(e);
        var targetPoint = new PIXI.Point(e.x, e.y);
        addAimingPointer(centerPoint, targetPoint);
        rotateAimingPointer(centerPoint, targetPoint);
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
function handleChatResize() {
    document.querySelector("#chatResizeBar").addEventListener("pointerdown", (ev) => {
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
                    $(UI.ChatFrame).animate({ "height": 150 }, 200);
                }
                else {
                    $(UI.ChatFrame).animate({ "height": 35 }, 200);
                }
            }
        }
        window.addEventListener("pointermove", pointerMove);
        window.addEventListener("pointerup", pointerUp);
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
function handleDebugFrame() {
    document.querySelector("#jsErrorsLink").addEventListener("click", ev => {
        UI.ShowModal("Error Log", Main.ErrorLog);
    });
}
function handleKeyboardInput() {
    window.addEventListener("blur", e => {
        // Release all keydowns on window blur.
        Object.keys(Input.InputKeyStates).forEach(x => {
            Input.InputKeyStates[x] = false;
        });
    });
    window.addEventListener("keydown", e => {
        if (document.querySelectorAll("input:focus").length > 0) {
            return;
        }
        e.preventDefault();
        var keybind = Settings.Roaming.Keybinds.find(x => x.Key == e.key);
        if (keybind != null) {
            Input.InputKeyStates[keybind.Name] = true;
            sendKeyboardMovementState();
        }
    });
    window.addEventListener("keyup", e => {
        if (document.querySelectorAll("input:focus").length > 0) {
            return;
        }
        e.preventDefault();
        var keybind = Settings.Roaming.Keybinds.find(x => x.Key == e.key);
        if (keybind != null) {
            Input.InputKeyStates[keybind.Name] = false;
            sendKeyboardMovementState();
        }
    });
}
function handleMenuButton() {
    document.querySelector("#menuButton").addEventListener("pointerdown", (ev) => {
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
            wrapper.style.height = "auto";
            wrapper.style.overflow = "auto";
        }
        function pointerUp(ev) {
            if (ev.pointerId != pointerID) {
                return;
            }
            ev.preventDefault();
            window.removeEventListener("pointermove", pointerMove);
            window.removeEventListener("pointerup", pointerUp);
            if (!preventClick) {
                if (wrapper.clientWidth <= 45) {
                    $(wrapper).animate({ "width": 200 }, 200);
                    wrapper.style.height = "auto";
                    wrapper.style.overflow = "auto";
                }
                else {
                    wrapper.style.overflow = "hidden";
                    $(wrapper).animate({ "width": 45, "height": 45 }, { duration: 200, queue: false });
                }
            }
        }
        window.addEventListener("pointermove", pointerMove);
        window.addEventListener("pointerup", pointerUp);
    });
}
function handleMenuHeaderClick() {
    document.querySelectorAll("#menuWrapper .menu-section-header").forEach((value, index) => {
        value.addEventListener("click", ev => {
            ev.currentTarget.nextElementSibling.classList.toggle("menu-body-closed");
        });
    });
}
function handleMenuOptionsButtons() {
    document.querySelector("#buttonFullscreen").addEventListener("click", ev => {
        if (document.documentElement.requestFullscreen) {
            if (document.fullscreen) {
                document.exitFullscreen();
            }
            else {
                document.documentElement.requestFullscreen();
            }
        }
        else if (document.documentElement.mozRequestFullScreen) {
            if (document.mozFullScreen) {
                document.mozCancelFullScreen();
            }
            else {
                document.documentElement.mozRequestFullScreen();
            }
        }
    });
    document.querySelector("#toggleDebugWindow").addEventListener("click", ev => {
        Settings.Local.IsDebugEnabled = !Settings.Local.IsDebugEnabled;
    });
    document.querySelector("#logoutButton").addEventListener("click", ev => {
        UI.ShowModal("Confirm Logout", "Are you sure you want to log out?", `
            <button class="btn btn-primary" onclick="
            After.Sockets.IsDisconnectExpected = true;
            After.Sockets.Connection.stop();">Logout</button>
        `);
    });
    document.querySelector("#toggleTouchControls").addEventListener("click", ev => {
        Settings.Local.AreTouchControlsEnabled = !Settings.Local.AreTouchControlsEnabled;
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
        var wrapperRect = outer.getBoundingClientRect();
        var centerX = wrapperRect.left + (wrapperRect.width / 2);
        var centerY = wrapperRect.top + (wrapperRect.height / 2);
        var centerPoint = new PIXI.Point(centerX, centerY);
        var evPoint = new PIXI.Point(ev.x, ev.y);
        var distance = Math.min(PixiHelper.GetDistanceBetween(centerPoint, evPoint), outer.clientWidth / 2);
        var angle = PixiHelper.GetAngleInDegrees(centerPoint, evPoint);
        Input.QueueMovementStateUpdate("UpdateMovementInput", { Angle: angle, Force: (distance / (outer.clientHeight / 2)) });
        inner.style.transform = `rotate(${angle}deg) translateX(-${distance}px)`;
    }
    function movementUp(ev) {
        if (ev.pointerId != pointerID) {
            return;
        }
        Input.QueueMovementStateUpdate("UpdateMovementInput", { Angle: 0, Force: 0 });
        window.removeEventListener("pointermove", movementMove);
        window.removeEventListener("pointerup", movementUp);
        inner.style.transform = "";
        inner.style.backgroundColor = "";
    }
    outer.addEventListener("pointerdown", ev => {
        pointerID = ev.pointerId;
        window.addEventListener("pointermove", movementMove);
        window.addEventListener("pointerup", movementUp);
        inner.style.backgroundColor = "white";
        movementMove(ev);
    });
}
function removeAimingPointer() {
    var index = Main.Renderer.PixiApp.stage.children.findIndex(x => x.name == "Aiming Pointer");
    if (index > -1) {
        Main.Renderer.PixiApp.stage.removeChildAt(index);
    }
}
function rotateAimingPointer(centerPoint, targetPoint) {
    var pointer = Main.Renderer.PixiApp.stage.children.find(x => x.name == "Aiming Pointer");
    if (pointer != null) {
        pointer.rotation = PixiHelper.GetAngleInRadians(centerPoint, targetPoint);
    }
}
function sendKeyboardMovementState() {
    var xVector = 0;
    var yVector = 0;
    if (Input.InputKeyStates.Left) {
        xVector--;
    }
    if (Input.InputKeyStates.Right) {
        xVector++;
    }
    if (Input.InputKeyStates.Up) {
        yVector--;
    }
    if (Input.InputKeyStates.Down) {
        yVector++;
    }
    var angle = PixiHelper.GetAngleInDegrees(new PIXI.Point(0, 0), new PIXI.Point(xVector, yVector));
    var force = Math.min(Math.abs(xVector) + Math.abs(yVector), 1);
    Input.QueueMovementStateUpdate("UpdateMovementInput", { Angle: angle, Force: force });
}
//# sourceMappingURL=Input.js.map