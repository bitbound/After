namespace After.App {
    export class UI {
        constructor() {

        }
        AddChatMessage(Channel: string, ChannelColor: string, From: string, Message: string, MessageColor: string) {
            var divMessage = document.createElement("div");
            var spanChannel = document.createElement("span");
            spanChannel.innerText = `([${Channel}] ${From}: `;
            spanChannel.style.color = MessageColor;
            var spanMessage = document.createElement("span");
            spanMessage.innerText = Message;
            divMessage.appendChild(spanChannel);
            divMessage.appendChild(spanMessage);
            $("#divChatMessageWindow").append(divMessage);
            $("#divChatMessageWindow").append("<br/>");

            var divChat = document.getElementById("divChatMessageWindow");
            if (divChat != null) {
                divChat.scrollTop = divChat.scrollHeight;
            }
        };
        AddMessageNoSender(Message: string, MessageColor: string) {
            var divMessage = document.createElement("span");
            divMessage.style.color = MessageColor;
            divMessage.innerText = Message;
            $("#divChatMessageWindow").append(divMessage);
            $("#divChatMessageWindow").append("<br/>");
            var divChat = document.getElementById("divChatMessageWindow");
            if (divChat != null) {
                if ($("#divChatMessageWindow").height() == 0) {
                    $("#divChatIconBorder").addClass("blinking");
                }
                divChat.scrollTop = divChat.scrollHeight;
            }
        };
    }
}