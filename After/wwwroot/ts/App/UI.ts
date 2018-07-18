import { Utilities } from "./Utilities.js";
import { PixiHelper } from "./PixiHelper.js";
import { Input } from "./Input.js";
import { Me } from "./Me.js";
import { Settings } from "./Settings.js";

export const UI = new class {
    UpdatePlayerStats(): void {
        this.ChargeProgress.innerText = String(Me.Character.CurrentCharge);
        this.ChargeProgress.style.width = String(Me.Character.CurrentCharge / Me.Character.MaxEnergy * 100) + "%";

        this.EnergyProgress.innerText = String(Me.Character.CurrentEnergy);
        this.EnergyProgress.style.width = String(Me.Character.CurrentEnergy / Me.Character.MaxEnergy * 100) + "%";

        this.WillpowerProgress.innerText = String(Me.Character.CurrentWillpower);
        this.WillpowerProgress.style.width = String(Me.Character.CurrentWillpower / Me.Character.MaxWillpower * 100) + "%";
    }
    get ChargeProgress(): HTMLDivElement {
        return document.querySelector("#chargeProgress");
    }
    get StatsFrame():HTMLDivElement {
        return document.querySelector("#statsFrame");
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
    }

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
    ShowGenericError(): void {
        this.ShowModal("Error", "An error occurred during the last operation.", "");
    };
    ShowModal(title: string, message: string, buttonsHTML: string = "") {
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
            ev.currentTarget.parentElement.remove();
        });
        $(".modal")["modal"]();
    };
}