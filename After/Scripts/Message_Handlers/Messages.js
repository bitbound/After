var After;
(function (After) {
    var Message_Handlers;
    (function (Message_Handlers) {
        var Messages;
        (function (Messages) {
            function HandleChat(jsonMessage) {
                switch (jsonMessage.Channel) {
                    case "Global":
                        var spanMessage = document.createElement("span");
                        spanMessage.style.color = "whitesmoke";
                        var spanChannel = document.createElement("span");
                        spanChannel.innerText = "(" + jsonMessage.Channel + ") " + jsonMessage.Username + ": ";
                        spanChannel.style.color = "seagreen";
                        spanMessage.innerText = jsonMessage.Message;
                        $("#divChatMessageWindow").append(spanChannel);
                        $("#divChatMessageWindow").append(spanMessage);
                        $("#divChatMessageWindow").append("<br/>");
                        break;
                    case "System":
                        var spanMessage = document.createElement("span");
                        spanMessage.style.color = "whitesmoke";
                        spanMessage.innerText = jsonMessage.Message;
                        $("#divChatMessageWindow").append(spanMessage);
                        $("#divChatMessageWindow").append("<br/>");
                        break;
                    default:
                        break;
                }
                var divChat = document.getElementById("divChatMessageWindow");
                if (divChat != null) {
                    if ($("#divChatMessageWindow").height() == 0) {
                        $("#divChatIconBorder").addClass("blinking");
                    }
                    divChat.scrollTop = divChat.scrollHeight;
                }
            }
            Messages.HandleChat = HandleChat;
            ;
        })(Messages = Message_Handlers.Messages || (Message_Handlers.Messages = {}));
    })(Message_Handlers = After.Message_Handlers || (After.Message_Handlers = {}));
})(After || (After = {}));
//# sourceMappingURL=Messages.js.map