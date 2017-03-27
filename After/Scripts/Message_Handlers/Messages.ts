namespace After.Message_Handlers.Messages {
    export function HandleChat(jsonMessage) {
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
    };
}