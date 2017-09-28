namespace After.Message_Handlers.Accounts {
    export function HandleAccountCreation(JsonMessage) {
        After.Utilities.RemoveLoading();
        if (JsonMessage.Result == "ok") {
            if (localStorage["RememberMe"] == "true") {
                localStorage["AuthenticationToken"] = JsonMessage.AuthenticationToken;
            }
            After.Controls.Game.Init();
        }
        else {
            if (JsonMessage.Result == "exists") {
                $("#divCreateAccountStatus").hide();
                $("#divCreateAccountStatus").text("That account name already exists.");
                $("#divCreateAccountStatus").fadeIn();
                return;
            }
        };
    };
    export function HandleLogon(JsonMessage) {
        After.Utilities.RemoveLoading();
        if (JsonMessage.Result == "new required") {
            $("#divNewPassword").slideDown();
            $("#divLoginStatus").hide();
            $("#divLoginStatus").text("A new password is required.");
            $("#divLoginStatus").fadeIn();
        }
        else if (JsonMessage.Result == "password mismatch") {
            $("#divLoginStatus").hide();
            $("#divLoginStatus").text("The passwords do not match.");
            $("#divLoginStatus").fadeIn();
        }
        else if (JsonMessage.Result == "locked") {
            $("#divLoginStatus").hide();
            $("#divLoginStatus").text("Your account has been locked.  Please try again in a while.");
            $("#divLoginStatus").fadeIn();
        }
        else if (JsonMessage.Result == "ok") {
            if (JsonMessage.Note == "LoginElsewhere") {
                After.Utilities.ShowDialog("Your account was already logged in from another location and was forced off by this login session.", "black", "OK", null);
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
        }
        else if (JsonMessage.Result == "expired") {
            $("#divLoginStatus").hide();
            $("#divLoginStatus").text("Session expired.  Please log in again.");
            $("#divLoginStatus").fadeIn();
            $("#inputPassword").val("");
            localStorage.removeItem("Username");
            localStorage.removeItem("AuthenticationToken");
        }
        else if (JsonMessage.Result == "banned") {
            After.Utilities.ShowDialog("Your account is banned.  If you believe this is a mistake, please contact support.", "red", "OK", null);
        }
        $("#buttonLogin").removeAttr("disabled");
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
        After.Utilities.ShowDialog("Your were disconnected because your account was logged in from another location.", "black", "OK", null);
    }
    export function HandleForgotPassword(JsonMessage) {
        After.Utilities.RemoveLoading();
        var result = JsonMessage.Result;
        if (result == "empty") {
            After.Utilities.ShowDialog("You must enter a username first.", "black", "OK", null);
        }
        else if (result == "unknown") {
            After.Utilities.ShowDialog("The specified username wasn't found.", "black", "OK", null);
        }
        else if (result == "no email") {
            After.Utilities.ShowDialog("A recovery email hasn't been set up for that account.", "black", "OK", null);
        }
        else if (result == "failed") {
            After.Utilities.ShowDialog("An error has occurred.  Try reloading After.  If the issue persists, please contact translucency_software@outlook.com.", "darkred", "OK", null);
        }
        else if (result == "ok") {
            After.Utilities.ShowDialog("Password reset successful!<br/><br/>A temporary password has been sent to your email (remember to check in junk/spam).", "black", "OK", null);
        }
    }
    export function HandleWarned(JsonMessage) {
        After.Connection.IsDisconnectExpected = true;
        After.Utilities.ShowDialog("You have been disconnected for suspicious activity.  Your account has been flagged, and any future offenses will result in a permanent ban.  If you believe this was in error, please contact support.", "red", "OK", null);
    }
    export function HandleBanned(JsonMessage) {
        After.Connection.IsDisconnectExpected = true;
        After.Utilities.ShowDialog("You have been permanently banned for repeated suspicious activity.  If you believe this was in error, please contact support.", "red", "OK", null);
    }
}