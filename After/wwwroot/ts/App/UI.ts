import { Utilities } from "./Utilities.js";
import { PixiHelper } from "./PixiHelper.js";
import { Input } from "./Input.js";
import { Me } from "./Me.js";
import { Settings } from "./Settings.js";
import { Main } from "../Main.js";

export const UI = new class {
   
    get ChargeProgress(): HTMLDivElement {
        return document.querySelector("#chargeProgress");
    }
    get DebugFrame():HTMLDivElement {
        return document.querySelector("#debugFrame");
    }
    get EnergyProgress(): HTMLDivElement {
        return document.querySelector("#energyProgress");
    }
    get Joystick(): HTMLDivElement {
        return document.querySelector("#moveJoystickOuter");
    }
    get FPSSpan(): HTMLSpanElement {
        return document.querySelector("#fpsSpan");
    }
    get WillpowerProgress(): HTMLDivElement {
        return document.querySelector("#willpowerProgress");
    }
    get ChatMessages(): HTMLDivElement {
        return document.querySelector("#chatMessages");
    }
    get ChatChannelSelect(): HTMLSelectElement {
        return document.querySelector("#selectChatChannel");
    }
    get ChatInput(): HTMLInputElement {
        return document.querySelector("#chatInput");
    }
    get ChatFrame(): HTMLDivElement {
        return document.querySelector("#chatFrame");
    };
    AppendMessageToWindow(message: string) {
        var shouldScroll = false;
        if (this.ChatMessages.scrollTop + this.ChatMessages.clientHeight >= this.ChatMessages.scrollHeight) {
            shouldScroll = true;
        }
        var messageDiv = document.createElement("div");
        messageDiv.innerHTML = message;
        this.ChatMessages.appendChild(messageDiv);
        if (shouldScroll) {
            this.ChatMessages.scrollTop = this.ChatMessages.scrollHeight;
        }
    }
    AddDebugMessage(message: string, jsonData: any, addBlankLines: number = 0) {
        if (Settings.IsDebugEnabled) {
            var temp = new Array<any>();
            var jsonHTML = "";
            if (jsonData) {

                jsonHTML = JSON.stringify(jsonData, function (key, value) {
                    if (typeof value == "object" && value != null) {
                        if (temp.findIndex(x => x == value) > -1) {
                            return "[Possible circular reference.]"
                        }
                        else {
                            temp.push(value);
                        }
                    }
                    return value;
                }, "&emsp;").split("\n").join("<br/>").split(" ").join("&nbsp;");
                temp = null;
            }
            var messageText = `<div style="color:${Settings.Colors.DebugMessage}">[Debug]: ${Utilities.EncodeForHTML(message) + jsonHTML}</div>`;
            for (var i = 0; i < addBlankLines; i++) {
                messageText += "<br>";
            }
            this.AppendMessageToWindow(messageText);
        }
    }
    AddTextToEncode(message: string, addBlankLines: number = 0) {
        var messageText = Utilities.EncodeForHTML(message);
        for (var i = 0; i < addBlankLines; i++) {
            messageText += "<br>";
        }
        this.AppendMessageToWindow(messageText);
    };
    AddRawHTMLMessage(html: string, addBlankLines: number = 0) {
        for (var i = 0; i < addBlankLines; i++) {
            html += "<br>";
        }
        this.AppendMessageToWindow(html);
    };
    AddSystemMessage(message: string, addBlankLines: number = 0) {
        var messageText = `<div style="color:${Settings.Colors.SystemMessage}">[System]: ${message}</div>`;
        for (var i = 0; i < addBlankLines; i++) {
            messageText += "<br>";
        }
        this.AppendMessageToWindow(messageText);
    };
    AddGlobalChat(characterName:string, message: string, color: string) {
        var messageText = `<div>
                <span style="color:${Settings.Colors.GlobalChat}">[Global] </span>
                <span style="color:${color}">${characterName}</span>: 
                ${message}</div>`;
        this.AppendMessageToWindow(messageText);
    };
    ApplyDataBinds() {
        document.querySelectorAll("[data-bind]").forEach((elem: HTMLElement, index) => {
            var qualifiedObject = elem.getAttribute("data-bind");
            var lastDot = qualifiedObject.lastIndexOf(".");
            var dataObject = eval(qualifiedObject.substring(0, lastDot));
            var propertyName = qualifiedObject.substring(lastDot + 1);
            var dataRender = elem.getAttribute("data-render");
            
            if (elem.classList.contains("toggle-switch-outer")) {
                dataBindOneWay(dataObject, propertyName, elem, "on", null, null, eval(dataRender));
                elem.addEventListener("click", ev => {
                    (ev.currentTarget as HTMLElement).setAttribute("on", String((ev.currentTarget as HTMLElement).getAttribute("on") == "true"));

                    eval((ev.currentTarget as HTMLElement).getAttribute("data-bind") + " = " + (ev.currentTarget as HTMLElement).getAttribute("on"));
                });
            }
            else if (elem.hasAttribute("value")) {
                dataBindTwoWay(dataObject, propertyName, elem, "value", null, null, ["onchange"], eval(dataRender));
            }
            else {
                dataBindOneWay(dataObject, propertyName, elem, "innerHTML", null, null, eval(dataRender));
            }
        });
    }

    ShowGenericError(): void {
        this.ShowModal("Error", "An error occurred during the last operation.", "");
    };
    ShowModal(title: string, message: string, buttonsHTML: string = "", onDismissCallback: VoidFunction = null) {
        var modalHTML = `<div class="modal fade" tabindex="-1" role="dialog">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                ${message}
              </div>
              <div class="modal-footer">
                ${buttonsHTML}
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>`;
        var wrapperDiv = document.createElement("div");
        wrapperDiv.innerHTML = modalHTML;
        document.body.appendChild(wrapperDiv);
        $(".modal").on("hidden.bs.modal", ev => {
            try {
                if (onDismissCallback) {
                    onDismissCallback();
                }
            }
            finally {
                ev.currentTarget.parentElement.remove();
            }
        });
        $(".modal")["modal"]();
    };
    UpdateStatBars(): void {
        this.ChargeProgress.innerText = String(Me.Character.CurrentCharge);
        this.ChargeProgress.style.width = String(Me.Character.CurrentCharge / Me.Character.MaxEnergy * 100) + "%";

        this.EnergyProgress.innerText = String(Me.Character.CurrentEnergy);
        this.EnergyProgress.style.width = String(Me.Character.CurrentEnergy / Me.Character.MaxEnergy * 100) + "%";

        this.WillpowerProgress.innerText = String(Me.Character.CurrentWillpower);
        this.WillpowerProgress.style.width = String(Me.Character.CurrentWillpower / Me.Character.MaxWillpower * 100) + "%";
    }
}

function dataBindOneWay(
    dataObject: Object,
    objectProperty: string,
    element: HTMLElement,
    elementPropertyKey: string,
    postSetterCallback: Function = null,
    preGetterCallback: Function = null,
    dataRenderCallback: (value) => {} = null) {
    var backingValue = dataObject[objectProperty];
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
                if (dataRenderCallback) {
                    element[elementPropertyKey] = dataRenderCallback(value);
                }
                else {
                    element[elementPropertyKey] = value;
                }
            }

            else {
                if (dataRenderCallback) {
                    element.setAttribute(elementPropertyKey, String(dataRenderCallback(value)));
                }
                else {
                    element.setAttribute(elementPropertyKey, value);
                }
            }

            if (postSetterCallback) {
                postSetterCallback(value);
            }
        }
    });

    dataObject[objectProperty] = backingValue;
};

function dataBindTwoWay(dataObject: Object, objectProperty: string,
    element: HTMLElement, elementPropertyKey: string,
    postSetterCallback: Function = null, preGetterCallback: Function = null,
    elementEventTriggers: Array<string>,
    dataRenderCallback: (value) => {} = null) {

    var backingValue = dataObject[objectProperty];

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
                if (dataRenderCallback) {
                    element[elementPropertyKey] = dataRenderCallback(value);
                }
                else {
                    element[elementPropertyKey] = value;
                }
            }

            else {
                 if (dataRenderCallback) {
                    element.setAttribute(elementPropertyKey, String(dataRenderCallback(value)));
                }
                else {
                    element.setAttribute(elementPropertyKey, value);
                }
            }

            if (postSetterCallback) {
                postSetterCallback(value);
            }
        }
    });

    dataObject[objectProperty] = backingValue;

    elementEventTriggers.forEach(trigger => {
        eval(`element.${trigger} = function(e) {
            ${element.getAttribute("data-bind")} = e.currentTarget${element.hasAttribute(elementPropertyKey) ? ".getAttribute(" + elementPropertyKey + ")" : "['" + elementPropertyKey + "']"};
        };`)
    });
};