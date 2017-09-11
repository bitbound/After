var After;
(function (After) {
    var Message_Handlers;
    (function (Message_Handlers) {
        var Accounts;
        (function (Accounts) {
            function HandleAccountCreation(JsonMessage) {
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
                }
                ;
            }
            Accounts.HandleAccountCreation = HandleAccountCreation;
            ;
            function HandleLogon(JsonMessage) {
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
                }
                else if (JsonMessage.Result == "expired") {
                    $("#divLoginStatus").hide();
                    $("#divLoginStatus").text("Session expired.  Please log in again.");
                    $("#divLoginStatus").fadeIn();
                    $("#inputPassword").val("");
                    localStorage.removeItem("Username");
                    localStorage.removeItem("AuthenticationToken");
                }
                ;
                $("#buttonLogin").removeAttr("disabled");
            }
            Accounts.HandleLogon = HandleLogon;
            ;
            function HandleConnected(JsonMessage) {
                var spanMessage = document.createElement("span");
                spanMessage.style.color = "whitesmoke";
                spanMessage.innerText = JsonMessage.Username + " has connected.";
                $("#divChatMessageWindow").append(spanMessage);
                $("#divChatMessageWindow").append("<br/>");
            }
            Accounts.HandleConnected = HandleConnected;
            function HandleDisconnected(JsonMessage) {
                var spanMessage = document.createElement("span");
                spanMessage.style.color = "whitesmoke";
                spanMessage.innerText = JsonMessage.Username + " has disconnected.";
                $("#divChatMessageWindow").append(spanMessage);
                $("#divChatMessageWindow").append("<br/>");
            }
            Accounts.HandleDisconnected = HandleDisconnected;
            function HandleLoginElsewhere(JsonMessage) {
                After.Utilities.ShowDialog("Your were disconnected because your account was logged in from another location.<br/><br/>If this wasn't you, you should change your password immediately.", "black", "OK", null);
            }
            Accounts.HandleLoginElsewhere = HandleLoginElsewhere;
            function HandleForgotPassword(JsonMessage) {
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
                    After.Utilities.ShowDialog("An error has occurred.  Try reloading After.  If the issue persists, please contact support@after-game.net.", "darkred", "OK", null);
                }
                else if (result == "ok") {
                    After.Utilities.ShowDialog("Password reset successful!<br/><br/>A temporary password has been sent to your email (remember to check in junk/spam).", "black", "OK", null);
                }
            }
            Accounts.HandleForgotPassword = HandleForgotPassword;
        })(Accounts = Message_Handlers.Accounts || (Message_Handlers.Accounts = {}));
    })(Message_Handlers = After.Message_Handlers || (After.Message_Handlers = {}));
})(After || (After = {}));
