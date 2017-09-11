var After;
(function (After) {
    var Message_Handlers;
    (function (Message_Handlers) {
        var Messages;
        (function (Messages) {
            function HandleChat(JsonData) {
                switch (JsonData.Channel) {
                    case "Global":
                        var spanMessage = document.createElement("span");
                        spanMessage.style.color = "whitesmoke";
                        var spanChannel = document.createElement("span");
                        spanChannel.innerText = "(" + JsonData.Channel + ") " + JsonData.Username + ": ";
                        spanChannel.style.color = "seagreen";
                        spanMessage.innerText = JsonData.Message;
                        $("#divChatMessageWindow").append(spanChannel);
                        $("#divChatMessageWindow").append(spanMessage);
                        $("#divChatMessageWindow").append("<br/>");
                        break;
                    case "System":
                        After.Game.AddChatMessage(JsonData.Message, "whitesmoke");
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
            function HandleAdmin(JsonData) {
                var spanMessage = document.createElement("span");
                spanMessage.style.color = "white";
                spanMessage.innerText = JsonData.Message;
                $("#divAdminMessageWindow").append(spanMessage);
                $("#divAdminMessageWindow").append("<br/>");
                var divAdmin = document.getElementById("divAdminMessageWindow");
                if (divAdmin != null) {
                    if ($("#divAdminMessageWindow").height() == 0) {
                        $("#divAdminIconBorder").addClass("blinking");
                    }
                    divAdmin.scrollTop = divAdmin.scrollHeight;
                }
            }
            Messages.HandleAdmin = HandleAdmin;
        })(Messages = Message_Handlers.Messages || (Message_Handlers.Messages = {}));
    })(Message_Handlers = After.Message_Handlers || (After.Message_Handlers = {}));
})(After || (After = {}));
