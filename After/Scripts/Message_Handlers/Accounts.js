var After;
(function (After) {
    var Message_Handlers;
    (function (Message_Handlers) {
        var Accounts;
        (function (Accounts) {
            function HandleAccountCreation(jsonMessage) {
                if (jsonMessage.Result == "ok") {
                    if (localStorage["RememberMe"] == "true") {
                        localStorage["AuthenticationToken"] = jsonMessage.AuthenticationToken;
                    }
                    After.Controls.Game.Init();
                }
                else {
                    if (jsonMessage.Result == "exists") {
                        $("#divLoginStatus").hide();
                        $("#divLoginStatus").text("That account name already exists.");
                        $("#divLoginStatus").fadeIn();
                        return;
                    }
                }
                ;
            }
            Accounts.HandleAccountCreation = HandleAccountCreation;
            ;
            function HandleLogon(jsonMessage) {
                if (jsonMessage.Result == "ok") {
                    if (jsonMessage.Note == "LoginElsewhere") {
                        After.Utilities.ShowDialog("Your account was logged in from another location and was forced off by this login session.<br/><br/>If that wasn't you, you should change your password immediately.", "black", "OK", null);
                    }
                    if (localStorage["RememberMe"] == "true") {
                        localStorage["AuthenticationToken"] = jsonMessage.AuthenticationToken;
                    }
                    After.Controls.Game.Init();
                }
                else if (jsonMessage.Result == "failed") {
                    $("#divLoginStatus").hide();
                    $("#divLoginStatus").text("Incorrect username or password.");
                    $("#divLoginStatus").fadeIn();
                    $("#buttonLogin").removeAttr("disabled");
                    return;
                }
                else if (jsonMessage.Result == "expired") {
                    $("#divLoginStatus").hide();
                    $("#divLoginStatus").text("Session expired.  Please log in again.");
                    $("#divLoginStatus").fadeIn();
                    $("#inputPassword").val("");
                    localStorage.removeItem("Username");
                    localStorage.removeItem("AuthenticationToken");
                    $("#buttonLogin").removeAttr("disabled");
                    return;
                }
                ;
            }
            Accounts.HandleLogon = HandleLogon;
            ;
            function HandleConnected(jsonMessage) {
                var spanMessage = document.createElement("span");
                spanMessage.style.color = "whitesmoke";
                spanMessage.innerText = jsonMessage.Username + " has connected.";
                $("#divChatMessageWindow").append(spanMessage);
                $("#divChatMessageWindow").append("<br/>");
            }
            Accounts.HandleConnected = HandleConnected;
            function HandleDisconnected(jsonMessage) {
                var spanMessage = document.createElement("span");
                spanMessage.style.color = "whitesmoke";
                spanMessage.innerText = jsonMessage.Username + " has disconnected.";
                $("#divChatMessageWindow").append(spanMessage);
                $("#divChatMessageWindow").append("<br/>");
            }
            Accounts.HandleDisconnected = HandleDisconnected;
            function HandleLoginElsewhere(jsonMessage) {
                After.Utilities.ShowDialog("Your were disconnected because your account was logged in from another location.<br/><br/>If this wasn't you, you should change your password immediately.", "black", "OK", null);
            }
            Accounts.HandleLoginElsewhere = HandleLoginElsewhere;
        })(Accounts = Message_Handlers.Accounts || (Message_Handlers.Accounts = {}));
    })(Message_Handlers = After.Message_Handlers || (After.Message_Handlers = {}));
})(After || (After = {}));
//# sourceMappingURL=Accounts.js.map