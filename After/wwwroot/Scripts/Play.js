var After;
(function (After) {
    After.Debug = false;
    After.TouchScreen = false;
    After.Audio = new After.App.Audio();
    After.Canvas = new After.App.Canvas();
    After.Connection = new After.App.Connection();
    After.Drawing = new After.App.Drawing();
    After.Game = new After.App.Game();
    After.Input = new After.App.Input();
    After.Me = new After.App.Me();
    After.Settings = new After.App.Settings();
    After.Utilities = new After.App.Utilities();
})(After || (After = {}));
(function (After) {
    var Storage;
    (function (Storage) {
        Storage.Areas = new Array();
        Storage.Souls = new Array();
        Storage.FreeParticles = new Array();
        Storage.Landmarks = new Array();
    })(Storage = After.Storage || (After.Storage = {}));
})(After || (After = {}));
;
After.Temp = After.Temp || {};
After.Temp.Login = After.Temp.Login || {};
After.Temp.Login.TryLogin = function () {
    if (After.Connection.Socket.readyState != WebSocket.OPEN) {
        alert("Could not connect to the server.  Try refreshing the page.  If the issue persists, make sure you're using the latest version of Edge, Chrome, or Firefox.");
        return;
    }
    ;
    var strUsername = $("#inputUsername").val().trim();
    var strPassword = $("#inputPassword").val();
    if (strUsername == "") {
        $("#divLoginStatus").hide();
        $("#divLoginStatus").text("You must specify a username.");
        $("#divLoginStatus").fadeIn();
        return;
    }
    ;
    if (strPassword == "") {
        $("#divLoginStatus").hide();
        $("#divLoginStatus").text("You must specify a password.");
        $("#divLoginStatus").fadeIn();
        return;
    }
    ;
    $("#buttonLogin").attr("disabled", "true");
    var logonRequest = {
        "Category": "Accounts",
        "Type": "Logon",
        "Username": strUsername,
        "Password": strPassword,
        "NewPassword": $("#inputNewPassword").val(),
        "ConfirmNewPassword": $("#inputConfirmNewPassword").val()
    };
    After.Me.Name = logonRequest.Username;
    if (localStorage["RememberMe"] == "true") {
        localStorage["Username"] = $("#inputUsername").val();
        logonRequest["AuthenticationToken"] = localStorage["AuthenticationToken"];
    }
    else {
        localStorage.removeItem("Username");
        localStorage.removeItem("AuthenticationToken");
    }
    After.Utilities.ShowLoading();
    After.Connection.Socket.send(JSON.stringify(logonRequest));
};
After.Temp.Login.StartIntro = function () {
    After.Temp.Intro.Start();
};
After.Temp.Login.RememberMeChanged = function (e) {
    localStorage.setItem("RememberMe", String(e.currentTarget.checked));
    if (e.currentTarget.checked == false) {
        $("#inputPassword").val("");
    }
};
After.Temp.Login.ForgotPasswordClicked = function () {
    var username = $("#inputUsername").val().trim();
    if (username.length == 0) {
        After.Utilities.ShowDialog("You must enter your username first.", "black", "OK", null);
        return;
    }
    var request = {
        "Category": "Accounts",
        "Type": "ForgotPassword",
        "Username": username
    };
    After.Utilities.ShowLoading();
    After.Connection.Socket.send(JSON.stringify(request));
};
$(document).ready(function () {
    if (window.location.href.search("localhost") > -1) {
        After.Debug = true;
    }
    ;
    window.onerror = function (message, source, lineno, colno, error) {
        var ex = {
            Message: message,
            TimeStamp: new Date().toString(),
            Source: source,
            Line: lineno,
            Column: colno,
            Error: error
        };
        $.post(window.location.origin + "/Services/ErrorReporting", JSON.stringify(ex));
        if (After.Debug) {
            throw error;
        }
        else {
            console.log("Unhandled Error: " + JSON.stringify(ex));
        }
        return true;
    };
    window.onbeforeunload = function () {
        if (After.Connection.Socket.readyState == 1 && $("#divGame").is(":visible")) {
            return "Are you sure you want to leave without logging out first?";
        }
    };
    window.ontouchstart = function (event) {
        After.TouchScreen = true;
    };
    After.Connection.SetHandlers();
    if (localStorage["RememberMe"] == "true" && typeof localStorage["AuthenticationToken"] != "undefined") {
        $("#checkRememberMe")[0].checked = true;
        $("#inputUsername").val(localStorage["Username"]);
        $("#inputPassword").val("**********");
    }
    $("#inputPassword").on("input", function () {
        localStorage.removeItem("AuthenticationToken");
    });
});
