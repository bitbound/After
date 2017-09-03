var After;
(function (After) {
    After.Debug = false;
    After.TouchScreen = false;
    After.Audio = new After.App.Audio();
    After.Canvas = new After.App.Canvas();
    After.Connection = new After.App.Connection();
    After.Drawing = new After.App.Drawing();
    After.Game = new After.App.Game();
    After.Me = new After.App.Me();
    After.Settings = new After.App.Settings();
    After.Utilities = new After.App.Utilities();
})(After || (After = {}));
(function (After) {
    var World_Data;
    (function (World_Data) {
        World_Data.Areas = new Array();
        World_Data.Souls = new Array();
        World_Data.FreeParticles = new Array();
        World_Data.Landmarks = new Array();
    })(World_Data = After.World_Data || (After.World_Data = {}));
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
            Line: lineno,
            Column: colno,
            Error: error
        };
        $.post(window.location.origin + "/Services/ErrorReporting.cshtml", JSON.stringify(ex));
        if (After.Debug) {
            alert("Unhandled Error: " + JSON.stringify(ex));
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
