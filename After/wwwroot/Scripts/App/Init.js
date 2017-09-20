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
    After.Temp.Splash.Init();
});
