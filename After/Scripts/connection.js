var After;
(function (After) {
    After.Connection = {
        Socket: {},
        Init: function () {
            if (Object.keys(After.Connection.Socket).length == 0 || After.Connection.Socket.readyState != WebSocket.OPEN) {
                if (window.location.hostname == "localhost") {
                    After.Connection.Socket = new WebSocket("ws://" + location.host + location.pathname);
                }
                else {
                    After.Connection.Socket = new WebSocket("wss://" + location.host + location.pathname);
                }
                ;
                After.Connection.SetHandlers();
            }
            return After.Connection.Socket;
        },
        SendChat: function (e) {
            var strMessage = $("#inputChatInput").val();
            if (strMessage == "") {
                return;
            }
            var jsonMessage = { Type: "Chat", Channel: $("#selectChatChannel").val(), Message: strMessage };
            After.Connection.Socket.send(JSON.stringify(jsonMessage));
            $("#inputChatInput").val("");
        },
        HandleMessage: function (message) {
            var jsonMessage = JSON.parse(message);
            switch (jsonMessage.Type) {
                case "AccountCreation":
                    {
                        if (sessionStorage["Username"] == jsonMessage.Username) {
                            if (jsonMessage.Result == "ok") {
                                After.Controls.Game.Init();
                            }
                            else {
                                if (jsonMessage.Result == "exists") {
                                    $("#divCreateAccountStatus").text("That account name already exists.");
                                    return;
                                }
                            }
                            ;
                        }
                        var spanMessage = document.createElement("span");
                        spanMessage.style.color = "whitesmoke";
                        spanMessage.innerText = jsonMessage.Username + " has connected.";
                        $("#divChatMessageWindow").append(spanMessage);
                        $("#divChatMessageWindow").append("<br/>");
                        break;
                    }
                case "Logon":
                    {
                        if (sessionStorage["Username"] == jsonMessage.Username) {
                            if (jsonMessage.Result == "ok") {
                                After.Controls.Game.Init();
                            }
                            else if (jsonMessage.Result == "failed") {
                                $("#divLoginStatus").text("Incorrect username or password.");
                                $("#buttonLogin").attr("disabled", "false");
                                return;
                            }
                            ;
                        }
                        ;
                        var spanMessage = document.createElement("span");
                        spanMessage.style.color = "whitesmoke";
                        spanMessage.innerText = jsonMessage.Username + " has connected.";
                        $("#divChatMessageWindow").append(spanMessage);
                        $("#divChatMessageWindow").append("<br/>");
                        break;
                    }
                case "Chat":
                    {
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
                        break;
                    }
                case "Logoff":
                    {
                        var spanMessage = document.createElement("span");
                        spanMessage.style.color = "whitesmoke";
                        spanMessage.innerText = jsonMessage.Username + " has disconnected.";
                        $("#divChatMessageWindow").append(spanMessage);
                        $("#divChatMessageWindow").append("<br/>");
                        break;
                    }
                case "Event":
                    {
                        switch (jsonMessage.EventType) {
                            case "StartCharging":
                                {
                                    $("#buttonCharge").attr("disabled", "false");
                                    if (jsonMessage.Result == "ok") {
                                        After.Me.IsCharging = true;
                                        $('#divButtonCharge').hide();
                                        $('#divCharge').show();
                                        if (After.Temp.ChargeInterval != undefined) {
                                            window.clearInterval(After.Temp.ChargeInterval);
                                        }
                                        After.Temp.ChargeInterval = window.setInterval(function () {
                                            if (After.Me.IsCharging == false) {
                                                if (After.Me.CurrentCharge == 0) {
                                                    $('#divButtonCharge').show();
                                                    $('#divCharge').hide();
                                                    window.clearInterval(After.Temp.ChargeInterval);
                                                }
                                                return;
                                            }
                                            var divRect = document.getElementById("divCharge").getBoundingClientRect();
                                            var riseHeight = $("#divCharge").height() * .8;
                                            var chargePercent = After.Me.CurrentCharge / After.Me.MaxCharge;
                                            var startLeft = After.Utilities.GetRandom($("#divCharge").width() * .15, $("#divCharge").width() * .85, true);
                                            var startTop = $("#divCharge").height() * .5;
                                            var part = document.createElement("div");
                                            part.classList.add("particle");
                                            part.classList.add("anim-charge-button");
                                            $(part).css({
                                                left: startLeft,
                                                top: startTop,
                                            });
                                            $("#divCharge").append(part);
                                            window.setTimeout(function () {
                                                $(part).remove();
                                            }, 1100);
                                        }, 100);
                                    }
                                    // TODO: Else...
                                    break;
                                }
                            case "StopCharging":
                                {
                                    $("#buttonCharge").attr("disabled", "false");
                                    After.Me.IsCharging = false;
                                    break;
                                }
                            default:
                                break;
                        }
                        break;
                    }
                case "Query":
                    {
                        switch (jsonMessage.QueryType) {
                            case "StatUpdate":
                                {
                                    After.Me[jsonMessage.Stat] = jsonMessage.Amount;
                                    After.Me.UpdateStatsUI();
                                    break;
                                }
                            case "PlayerUpdate":
                                {
                                    for (var stat in jsonMessage.Player) {
                                        if (After.Me[stat] != undefined && jsonMessage.Player[stat] != undefined) {
                                            After.Me[stat] = jsonMessage.Player[stat];
                                        }
                                    }
                                    After.Me.UpdateStatsUI();
                                    break;
                                }
                            case "FirstLoad":
                                {
                                    for (var stat in jsonMessage.Player) {
                                        if (After.Me[stat] != undefined && jsonMessage.Player[stat] != undefined) {
                                            After.Me[stat] = jsonMessage.Player[stat];
                                        }
                                    }
                                    jsonMessage.Souls.forEach(function (value, index) {
                                        var soul = new After.Models.Soul();
                                        for (var stat in value) {
                                            soul[stat] = value[stat];
                                        }
                                        After.World_Data.Souls.push(soul);
                                    });
                                    After.Me.UpdateStatsUI();
                                    break;
                                }
                            default:
                                break;
                        }
                        break;
                    }
                default:
                    break;
            }
            ;
            var divChat = document.getElementById("divChatMessageWindow");
            if (divChat != null) {
                divChat.scrollTop = divChat.scrollHeight;
            }
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
                });
                divError.appendChild(divMessage);
                divError.appendChild(buttonRefresh);
                $(document.body).append(divError);
            };
            After.Connection.Socket.onmessage = function (e) {
                After.Connection.HandleMessage(e.data);
            };
        }
    };
})(After || (After = {}));
//# sourceMappingURL=Connection.js.map