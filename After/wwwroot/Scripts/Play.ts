namespace After {
    export var Debug = false;
    export var TouchScreen = false;
    export const Audio = new After.App.Audio();
    export const Connection = new After.App.Connection();
    export const Drawing = new After.App.Drawing();
    export const Game = new After.App.Game();
    export const Input = new After.App.Input();
    export const Me = new After.App.Me();
    export const Settings = new After.App.Settings();
    export const UI = new After.App.UI();
    export const Utilities = new After.App.Utilities();
    export const MessageHandlers = new After.App.MessageHandlers();
}

namespace After.Storage {
    export const Areas = new Array<After.Models.Area>();
    export const Souls = new Array<After.Models.Soul>();
    export const FreeParticles = new Array<After.Models.FreeParticle>();
    export const Landmarks = new Array<After.Models.Landmark>();
};


After.Temp = After.Temp || {};
After.Temp.Login = After.Temp.Login || {};
After.Temp.Login.TryLogin = function () {
    if (After.Connection.Socket.readyState != WebSocket.OPEN) {
        alert("Could not connect to the server.  Try refreshing the page.  If the issue persists, make sure you're using the latest version of Edge, Chrome, or Firefox.");
        return;
    };
    var strUsername = $("#inputUsername").val().trim();
    var strPassword = $("#inputPassword").val();
    if (strUsername == "") {
        $("#divLoginStatus").hide();
        $("#divLoginStatus").text("You must specify a username.");
        $("#divLoginStatus").fadeIn();
        return;
    };
    if (strPassword == "") {
        $("#divLoginStatus").hide();
        $("#divLoginStatus").text("You must specify a password.");
        $("#divLoginStatus").fadeIn();
        return;
    };
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
}

$(document).ready(function () {
    if (window.location.href.search("localhost") > -1) {
        After.Debug = true;
    };
    window.onerror = function (message, source, lineno, colno, error) {
        var ex = {
            Message: message,
            TimeStamp: new Date().toString(),
            Source: source,
            Line: lineno,
            Column: colno
        }
        var xhr = new XMLHttpRequest();
        xhr.responseType = "text";
        xhr.open("post", "/Services/ErrorReporting");
        xhr.send(JSON.stringify(ex));
        if (After.Debug) {
            throw message;
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
        ($("#checkRememberMe")[0] as HTMLInputElement).checked = true;
        $("#inputUsername").val(localStorage["Username"]);
        $("#inputPassword").val("**********");
    }
    $("#inputPassword").on("input", function () {
        localStorage.removeItem("AuthenticationToken");
    })
})