var After;
(function (After) {
    var App;
    (function (App) {
        class UI {
            constructor() {
            }
            AddChatMessage(Channel, ChannelColor, From, Message, MessageColor) {
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
            }
            ;
            AddMessageNoSender(Message, MessageColor) {
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
            }
            ;
        }
        App.UI = UI;
    })(App = After.App || (After.App = {}));
})(After || (After = {}));
//# sourceMappingURL=UI.js.map