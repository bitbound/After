import { Utilities } from "./Utilities.js";
import { Me } from "./Me.js";
import { Main } from "../Main.js";
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
    get DebugWindow() {
        return document.querySelector("#debugWindow");
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
    get ChatMessageWindow() {
        return document.querySelector("#chatMessages");
    }
    get ChatChannelSelect() {
        return document.querySelector("#selectChatChannel");
    }
    get ChatInput() {
        return document.querySelector("#chatInput");
    }
    get ChatWindowFrame() {
        return document.querySelector("#chatWindow");
    }
    AppendMessageToWindow(message) {
        var shouldScroll = false;
        if (this.ChatMessageWindow.scrollTop + this.ChatMessageWindow.clientHeight >= this.ChatMessageWindow.scrollHeight) {
            shouldScroll = true;
        }
        var messageDiv = document.createElement("div");
        messageDiv.innerHTML = message;
        this.ChatMessageWindow.appendChild(messageDiv);
        if (shouldScroll) {
            this.ChatMessageWindow.scrollTop = this.ChatMessageWindow.scrollHeight;
        }
    }
    AddDebugMessage(message, jsonData, addBlankLines = 0) {
        if (Main.Settings.IsDebugEnabled) {
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
};
//# sourceMappingURL=UI.js.map