var After;
(function (After) {
    var App;
    (function (App) {
        class Connection {
            constructor() {
                this.Socket = new WebSocket(location.origin.replace("http", "ws"));
            }
            SetHandlers() {
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
                    buttonRefresh.style.setProperty("float", "right");
                    buttonRefresh.onclick = function () { window.location.reload(true); };
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
                        "box-shadow": "10px 10px 5px rgba(255,255,255,.15)"
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
                    buttonRefresh.onclick = function () { window.location.reload(true); };
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
                        "box-shadow": "10px 10px 5px rgba(255,255,255,.15)"
                    });
                    divError.appendChild(divMessage);
                    divError.appendChild(buttonRefresh);
                    $(document.body).append(divError);
                };
                After.Connection.Socket.onmessage = function (e) {
                    var jsonMessage = JSON.parse(e.data);
                    if (typeof jsonMessage.Category == "undefined" || typeof jsonMessage.Type == "undefined") {
                        throw "Error handling message: " + e.data;
                    }
                    eval("After.Message_Handlers." + jsonMessage.Category + "." + "Handle" + jsonMessage.Type + "(jsonMessage);");
                };
            }
        }
        App.Connection = Connection;
    })(App = After.App || (After.App = {}));
})(After || (After = {}));
