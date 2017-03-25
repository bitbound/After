namespace After {
    export const Connection = {
        Socket: <WebSocket>{ },
        Init: function () {
            if (Object.keys(After.Connection.Socket).length == 0 || After.Connection.Socket.readyState != WebSocket.OPEN) {
                After.Connection.Socket = new WebSocket(location.origin.replace("http", "ws"));
                After.Connection.SetHandlers();
            }
            return After.Connection.Socket;
        },
        SendChat: function (e) {
            var strMessage = $("#inputChatInput").val();
            if (strMessage == "") {
                return;
            }
            var jsonMessage = {
                "Category": "Messages",
                "Type": "Chat",
                "Channel": $("#selectChatChannel").val(),
                "Message": strMessage
            };
            After.Connection.Socket.send(JSON.stringify(jsonMessage));
            $("#inputChatInput").val("");
        },
        SetHandlers: function () {
            After.Connection.Socket.onopen = function () {
                console.log("Connected.");
            };
            After.Connection.Socket.onerror = function (e) {
                console.log("Error.");
                var divError = document.createElement("div");
                var divMessage = document.createElement("div");
                var buttonRefresh = document.createElement("button");
                divMessage.innerHTML = "Your connection has been lost.<br/><br/>Click Refresh to return to the login page.<br/><br/>";
                buttonRefresh.innerHTML = "Refresh";
                buttonRefresh.type = "button";
                buttonRefresh.removeAttribute("style");
                buttonRefresh.style.setProperty("float","right");
                buttonRefresh.onclick = function () { window.location.reload(true) };
                $(divError).css({
                    "position": "absolute",
                    "font-weight": "bold",
                    "background-color": "lightgray",
                    "color": "red",
                    "border-radius": "10px",
                    "padding": "10px",
                    "border": "2px solid dimgray",
                    "top": "40%",
                    "left": "50%",
                    "transform": "translateX(-50%)",
                    "z-index": "3",
                });
                divError.appendChild(divMessage);
                divError.appendChild(buttonRefresh);
                $(document.body).append(divError);
            };
            After.Connection.Socket.onclose = function () {
                console.log("Closed.");
                var divError = document.createElement("div");
                var divMessage = document.createElement("div");
                var buttonRefresh = document.createElement("button");
                divMessage.innerHTML = "Your connection has been lost.<br/><br/>Click Refresh to return to the login page.<br/><br/>";
                buttonRefresh.innerHTML = "Refresh";
                buttonRefresh.type = "button";
                buttonRefresh.removeAttribute("style");
                buttonRefresh.style.setProperty("float", "right");
                buttonRefresh.onclick = function () { window.location.reload(true) };
                $(divError).css({
                    "position": "absolute",
                    "font-weight": "bold",
                    "background-color": "lightgray",
                    "color": "red",
                    "border-radius": "10px",
                    "padding": "10px",
                    "border": "2px solid dimgray",
                    "top": "40%",
                    "left": "50%",
                    "transform": "translateX(-50%)",
                    "z-index": "3",
                });
                divError.appendChild(divMessage);
                divError.appendChild(buttonRefresh);
                $(document.body).append(divError);
            };
            After.Connection.Socket.onmessage = function (e) {
                var jsonMessage = JSON.parse(e.data);
                eval("After.Socket_Handlers." + jsonMessage.Category + "." + "Handle" + jsonMessage.Type + "(jsonMessage);");
                var divChat = document.getElementById("divChatMessageWindow");
                if (divChat != null) {
                    divChat.scrollTop = divChat.scrollHeight;
                }
            };
        }
    }
}