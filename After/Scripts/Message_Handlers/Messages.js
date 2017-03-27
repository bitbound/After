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
                        if (jsonMessage.Channel == "Global") {
                            spanChannel.style.color = "seagreen";
                        }
                        spanMessage.innerText = jsonMessage.Message;
                        $("#divChatMessageWindow").append(spanChannel);
                        $("#divChatMessageWindow").append(spanMessage);
                        $("#divChatMessageWindow").append("<br/>");
                    default:
                }
            }
            Messages.HandleChat = HandleChat;
            ;
        })(Messages = Message_Handlers.Messages || (Message_Handlers.Messages = {}));
    })(Message_Handlers = After.Message_Handlers || (After.Message_Handlers = {}));
})(After || (After = {}));
//# sourceMappingURL=Messages.js.map