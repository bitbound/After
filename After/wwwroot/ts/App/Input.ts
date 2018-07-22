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
}
function handleMenuOptionsButtons() {
    document.querySelector("#buttonFullscreen").addEventListener("click", ev => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
        else if ((document.documentElement as any).mozRequestFullScreen) {
            (document.documentElement as any).mozRequestFullScreen();
        }
        else if ((document.documentElement as any).webkitRequestFullScreen) {
            (document.documentElement as any).webkitRequestFullScreen();
        }
    })
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
    document.querySelector("#chatOpenCloseWrapper").addEventListener("pointerdown", (ev: PointerEvent) => {
        var pointerID = ev.pointerId;
        var preventClick = false;
        var startY = ev.y;
        var startHeight = UI.ChatFrame.clientHeight;

        function pointerMove(ev2: PointerEvent) {
            if (ev2.pointerId != pointerID) {
                return;
            }
            if (Math.abs(startY - ev2.y) > 5) {
                preventClick = true;
            }
            UI.ChatFrame.style.height = String(Math.max(30, startHeight + startY - Math.max(0, ev2.y))) + "px";
        };
        function pointerUp(ev3: PointerEvent) {
            if (ev3.pointerId != pointerID) {
                return;
            }

            window.removeEventListener("pointerup", pointerUp);
            window.removeEventListener("pointermove", pointerMove);

            if (!preventClick) {
                if (Main.UI.ChatFrame.clientHeight <= 30) {
                    Utilities.Animate(UI.ChatFrame.style, "height", UI.ChatFrame.clientHeight, 150, "px", 200);
                }
                else {
                    Utilities.Animate(UI.ChatFrame.style, "height", UI.ChatFrame.clientHeight, 30, "px", 200);
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

        function pointerMove(ev2: PointerEvent) {
            if (ev2.pointerId != pointerID) {
                return;
            }
            if (ev2.pointerId != pointerID) {
                return;
            }
            if (Math.abs(startX - ev2.x) > 5) {
                preventClick = true;
            }
            wrapper.style.width = String(Math.max(30, startWidth + startX - Math.max(0, ev2.x))) + "px";
            wrapper.style.height = null;
            wrapper.style.overflow = "auto";
        }
        function pointerUp(ev3: PointerEvent) {
            if (ev3.pointerId != pointerID) {
                return;
            }
            window.removeEventListener("pointermove", pointerMove);
            window.removeEventListener("pointerup", pointerUp);
            if (!preventClick) {
                if (wrapper.clientWidth <= 35) {
                    Utilities.Animate(wrapper.style, "width", wrapper.clientWidth, 150, "px", 200);
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
    })
}

function handleMenuHeaderClick() {
    document.querySelectorAll("#menuWrapper .menu-header").forEach((value, index) => {
        value.addEventListener("click", ev => {
            (ev.currentTarget as HTMLElement).nextElementSibling.classList.toggle("menu-body-closed");
        })
    });
}

function dataBindOneWay(dataObject: Object, objectProperty: string,
    element: HTMLElement, elementPropertyKey: string,
    postSetterCallback: Function, preGetterCallback: Function) {
    var backingValue;

    Object.defineProperty(dataObject, objectProperty, {
        configurable: true,

        enumerable: true,

        get() {
            if (preGetterCallback) {
                preGetterCallback(backingValue);
            }

            return backingValue;
        },

        set(value: any) {
            backingValue = value;

            if (elementPropertyKey in element) {
                element[elementPropertyKey] = value;
            }

            else {
                element.setAttribute(elementPropertyKey, value);
            }

            if (postSetterCallback) {
                postSetterCallback(value);
            }
        }
    });
};

function dataBindTwoWay(dataObject: Object, objectProperty: string,
    element: HTMLElement, elementPropertyKey: string,
    postSetterCallback: Function, preGetterCallback: Function,
    elementEventTriggers: Array<string>) {

    var backingValue;

    Object.defineProperty(dataObject, objectProperty, {
        configurable: true,

        enumerable: true,

        get() {
            if (preGetterCallback) {
                preGetterCallback(backingValue);
            }

            return backingValue;
        },

        set(value: any) {
            backingValue = value;

            if (elementPropertyKey in element) {
                element[elementPropertyKey] = value;
            }

            else {
                element.setAttribute(elementPropertyKey, value);
            }

            if (postSetterCallback) {
                postSetterCallback(value);
            }
        }
    })

    elementEventTriggers.forEach(trigger => {
        eval(`Element.${trigger} = function(e) {
            ${element.getAttribute("data-object")}.${element.getAttribute("data-property")} = e.currentTarget${element.hasAttribute(elementPropertyKey) ? ".getAttribute(" + elementPropertyKey + ")" : "['" + elementPropertyKey + "']"};
        };`)
    });
};

function setAllDatabinds(dataChangedCallback: Function) {
    $("input[data-object][data-property]").each((index, elem: HTMLElement) => {
        dataBindTwoWay(eval(elem.getAttribute("data-object")), elem.getAttribute("data-property"), elem, "value", null, null, ["onchange"]);
    })

    $("div[data-object][data-property]").each((index, elem: HTMLElement) => {
        dataBindOneWay(eval(elem.getAttribute("data-object")), elem.getAttribute("data-property"), elem, "innerHTML", null, null);
    })

    $(".toggle-switch-outer[data-object][data-property]").each((index, elem: HTMLElement) => {
        dataBindOneWay(eval(elem.getAttribute("data-object")), elem.getAttribute("data-property"), elem, "on", null, null);
    })

    if (dataChangedCallback) {
        $("input[data-object][data-property]").on("change", (e) => {
            dataChangedCallback();
        })
    }

    $(".toggle-switch-outer[data-object][data-property]").on("click", e => {
        if (e.currentTarget.getAttribute("on") == "true") {
            e.currentTarget.setAttribute("on", "false");
        } else {
            e.currentTarget.setAttribute("on", "true");
        }

        eval(e.currentTarget.getAttribute("data-object") + "." + e.currentTarget.getAttribute("data-property") + " = " + e.currentTarget.getAttribute("on"));

        if (dataChangedCallback) {
            dataChangedCallback();
        }
    })
}