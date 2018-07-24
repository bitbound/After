import { Utilities } from "./Utilities.js";
import { Me } from "./Me.js";
import { Settings } from "./Settings.js";
export const UI = new class {
    UpdatePlayerStats() {
        this.ChargeProgress.innerText = String(Me.Character.CurrentCharge);
        this.ChargeProgress.style.width = String(Me.Character.CurrentCharge / Me.Character.MaxEnergy * 100) + "%";
        this.EnergyProgress.innerText = String(Me.Character.CurrentEnergy);
        this.EnergyProgress.style.width = String(Me.Character.CurrentEnergy / Me.Character.MaxEnergy * 100) + "%";
        this.WillpowerProgress.innerText = String(Me.Character.CurrentWillpower);
        this.WillpowerProgress.style.width = String(Me.Character.CurrentWillpower / Me.Character.MaxWillpower * 100) + "%";
    }
    get ChargeProgress() {
        return document.querySelector("#chargeProgress");
    }
    get StatsFrame() {
        return document.querySelector("#statsFrame");
    }
    get EnergyProgress() {
        return document.querySelector("#energyProgress");
    }
    get Joystick() {
        return document.querySelector("#moveJoystickOuter");
    }
    get FPSSpan() {
        return document.querySelector("#fpsSpan");
    }
    get WillpowerProgress() {
        return document.querySelector("#willpowerProgress");
    }
    get ChatMessages() {
        return document.querySelector("#chatMessages");
    }
    get ChatChannelSelect() {
        return document.querySelector("#selectChatChannel");
    }
    get ChatInput() {
        return document.querySelector("#chatInput");
    }
    get ChatFrame() {
        return document.querySelector("#chatFrame");
    }
    AppendMessageToWindow(message) {
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
    AddDebugMessage(message, jsonData, addBlankLines = 0) {
        if (Settings.IsDebugEnabled) {
            var temp = new Array();
            var jsonHTML = "";
            if (jsonData) {
                jsonHTML = JSON.stringify(jsonData, function (key, value) {
                    if (typeof value == "object" && value != null) {
                        if (temp.findIndex(x => x == value) > -1) {
                            return "[Possible circular reference.]";
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
    AddTextToEncode(message, addBlankLines = 0) {
        var messageText = Utilities.EncodeForHTML(message);
        for (var i = 0; i < addBlankLines; i++) {
            messageText += "<br>";
        }
        this.AppendMessageToWindow(messageText);
    }
    ;
    AddRawHTMLMessage(html, addBlankLines = 0) {
        for (var i = 0; i < addBlankLines; i++) {
            html += "<br>";
        }
        this.AppendMessageToWindow(html);
    }
    ;
    AddSystemMessage(message, addBlankLines = 0) {
        var messageText = `<div style="color:${Settings.Colors.SystemMessage}">[System]: ${message}</div>`;
        for (var i = 0; i < addBlankLines; i++) {
            messageText += "<br>";
        }
        this.AppendMessageToWindow(messageText);
    }
    ;
    AddGlobalChat(characterName, message, color) {
        var messageText = `<div>
                <span style="color:${Settings.Colors.GlobalChat}">[Global] </span>
                <span style="color:${color}">${characterName}</span>: 
                ${message}</div>`;
        this.AppendMessageToWindow(messageText);
    }
    ;
    ShowGenericError() {
        this.ShowModal("Error", "An error occurred during the last operation.", "");
    }
    ;
    ShowModal(title, message, buttonsHTML = "", onDismissCallback = null) {
        var modalHTML = `<div class="modal fade" tabindex="-1" role="dialog">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">${title}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                ${message}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                ${buttonsHTML}
              </div>
            </div>
          </div>
        </div>`;
        var wrapperDiv = document.createElement("div");
        wrapperDiv.innerHTML = modalHTML;
        document.body.appendChild(wrapperDiv);
        $(".modal").on("hidden.bs.modal", ev => {
            try {
                onDismissCallback();
            }
            finally {
                ev.currentTarget.parentElement.remove();
            }
        });
        $(".modal")["modal"]();
    }
    ;
};
function dataBindOneWay(dataObject, objectProperty, element, elementPropertyKey, postSetterCallback, preGetterCallback) {
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
        set(value) {
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
}
;
function dataBindTwoWay(dataObject, objectProperty, element, elementPropertyKey, postSetterCallback, preGetterCallback, elementEventTriggers) {
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
        set(value) {
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
    elementEventTriggers.forEach(trigger => {
        eval(`Element.${trigger} = function(e) {
            ${element.getAttribute("data-object")}.${element.getAttribute("data-property")} = e.currentTarget${element.hasAttribute(elementPropertyKey) ? ".getAttribute(" + elementPropertyKey + ")" : "['" + elementPropertyKey + "']"};
        };`);
    });
}
;
function setAllDatabinds(dataChangedCallback) {
    $("input[data-object][data-property]").each((index, elem) => {
        dataBindTwoWay(eval(elem.getAttribute("data-object")), elem.getAttribute("data-property"), elem, "value", null, null, ["onchange"]);
    });
    $("div[data-object][data-property]").each((index, elem) => {
        dataBindOneWay(eval(elem.getAttribute("data-object")), elem.getAttribute("data-property"), elem, "innerHTML", null, null);
    });
    $(".toggle-switch-outer[data-object][data-property]").each((index, elem) => {
        dataBindOneWay(eval(elem.getAttribute("data-object")), elem.getAttribute("data-property"), elem, "on", null, null);
    });
    if (dataChangedCallback) {
        $("input[data-object][data-property]").on("change", (e) => {
            dataChangedCallback();
        });
    }
    $(".toggle-switch-outer[data-object][data-property]").on("click", e => {
        if (e.currentTarget.getAttribute("on") == "true") {
            e.currentTarget.setAttribute("on", "false");
        }
        else {
            e.currentTarget.setAttribute("on", "true");
        }
        eval(e.currentTarget.getAttribute("data-object") + "." + e.currentTarget.getAttribute("data-property") + " = " + e.currentTarget.getAttribute("on"));
        if (dataChangedCallback) {
            dataChangedCallback();
        }
    });
}
//# sourceMappingURL=UI.js.map