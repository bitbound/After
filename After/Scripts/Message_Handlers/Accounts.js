var After;
(function (After) {
    var Message_Handlers;
    (function (Message_Handlers) {
        var Accounts;
        (function (Accounts) {
            function HandleAccountCreation(jsonMessage) {
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
            }
            Accounts.HandleAccountCreation = HandleAccountCreation;
            ;
            function HandleLogon(jsonMessage) {
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
            }
            Accounts.HandleLogon = HandleLogon;
            ;
            function HandleLogoff(jsonMessage) {
                var spanMessage = document.createElement("span");
                spanMessage.style.color = "whitesmoke";
                spanMessage.innerText = jsonMessage.Username + " has disconnected.";
                $("#divChatMessageWindow").append(spanMessage);
                $("#divChatMessageWindow").append("<br/>");
            }
            Accounts.HandleLogoff = HandleLogoff;
            ;
        })(Accounts = Message_Handlers.Accounts || (Message_Handlers.Accounts = {}));
    })(Message_Handlers = After.Message_Handlers || (After.Message_Handlers = {}));
})(After || (After = {}));
//# sourceMappingURL=Accounts.js.map