namespace After.Message_Handlers.Accounts {
    export function HandleAccountCreation(JsonMessage) {
        if (JsonMessage.Result == "ok") {
            if (localStorage["RememberMe"] == "true") {
                localStorage["AuthenticationToken"] = JsonMessage.AuthenticationToken;
            }
            After.Controls.Game.Init();
        }
        else {
            if (JsonMessage.Result == "exists") {
                $("#divLoginStatus").hide();
                $("#divLoginStatus").text("That account name already exists.");
                $("#divLoginStatus").fadeIn();
                return;
            }
        };
    };
    export function HandleLogon(JsonMessage) {
        if (JsonMessage.Result == "ok") {
            if (JsonMessage.Note == "LoginElsewhere") {
                After.Utilities.ShowDialog("Your account was logged in from another location and was forced off by this login session.<br/><br/>If that wasn't you, you should change your password immediately.", "black", "OK", null);
            }
            if (localStorage["RememberMe"] == "true") {
                localStorage["AuthenticationToken"] = JsonMessage.AuthenticationToken;
            }
            After.Controls.Game.Init();
        }
        else if (JsonMessage.Result == "failed") {
            $("#divLoginStatus").hide();
            $("#divLoginStatus").text("Incorrect username or password.");
            $("#divLoginStatus").fadeIn();
            $("#buttonLogin").removeAttr("disabled");
            return;
        }
        else if (JsonMessage.Result == "expired") {
            $("#divLoginStatus").hide();
            $("#divLoginStatus").text("Session expired.  Please log in again.");
            $("#divLoginStatus").fadeIn();
            $("#inputPassword").val("");
            localStorage.removeItem("Username");
            localStorage.removeItem("AuthenticationToken");
            $("#buttonLogin").removeAttr("disabled");
            return;
        };
    };

    export function HandleConnected(JsonMessage) {
        var spanMessage = document.createElement("span");
        spanMessage.style.color = "whitesmoke";
        spanMessage.innerText = JsonMessage.Username + " has connected.";
        $("#divChatMessageWindow").append(spanMessage);
        $("#divChatMessageWindow").append("<br/>");
    }
    export function HandleDisconnected(JsonMessage) {
        var spanMessage = document.createElement("span");
        spanMessage.style.color = "whitesmoke";
        spanMessage.innerText = JsonMessage.Username + " has disconnected.";
        $("#divChatMessageWindow").append(spanMessage);
        $("#divChatMessageWindow").append("<br/>");
    }
    export function HandleLoginElsewhere(JsonMessage) {
        After.Utilities.ShowDialog("Your were disconnected because your account was logged in from another location.<br/><br/>If this wasn't you, you should change your password immediately.", "black", "OK", null);
    }
    export function HandleRetrieveSettings(JsonMessage) {
        for (var setting in JsonMessage.Settings) {
            After.Settings[setting] = JsonMessage.Settings[setting];
        }
        for (var setting in After.Settings) {
            if (typeof After.Settings[setting] == 'boolean') {
                $('#divSideTabs div[prop="' + setting + '"]').attr("on", After.Settings[setting]);
            }
        }
    }
}