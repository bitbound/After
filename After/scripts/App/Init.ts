namespace After {
    export var Debug = false;
    export var TouchScreen = false;
    export const Audio = new After.App.Audio();
    export const Canvas = new After.App.Canvas();
    export const Connection = new After.App.Connection();
    export const Drawing = new After.App.Drawing();
    export const Game = new After.App.Game();
    export const Me = new After.App.Me();
    export const Settings = new After.App.Settings();
    export const Utilities = new After.App.Utilities();
}

namespace After.World_Data {
    export const Areas = new Array<After.Models.Area>();
    export const Souls = new Array<After.Models.Soul>();
    export const FreeParticles = new Array<After.Models.FreeParticle>();
    export const Landmarks = new Array<After.Models.Landmark>();
}

$(document).ready(function () {
    if (window.location.href.search("localhost") > -1) {
        After.Debug = true;
    };
    window.onerror = function (message, source, lineno, colno, error) {
        var ex = {
            Message: message,
            TimeStamp: new Date().toString(),
            Line: lineno,
            Column: colno,
            Error: error
        }
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

    window.ontouchstart = function(event) {
        After.TouchScreen = true;
    };
    After.Connection.SetHandlers();
    After.Temp.Splash.Init();

})