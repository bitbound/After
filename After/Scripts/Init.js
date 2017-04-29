$(document).ready(function () {
    if (window.location.href.search("localhost") > -1) {
        After.Debug = true;
    };
    window.onerror = function (message, source, lineno, colno, error) {
        var error = {
            Name: error.name,
            Message: message,
            TimeStamp: new Date().toString(),
            Line: lineno,
            Column: colno,
            StackTrace: error.stack
        }
        $.post(window.location.origin + "/Services/ErrorReporting.cshtml", JSON.stringify(error));
        if (After.Debug) {
            alert("Unhandled Error: " + JSON.stringify(error));
        }
        else {
            console.log("Unhandled Error: " + JSON.stringify(error));
        }
        return true;
    };
    window.onbeforeunload = function () {
        if (After.Connection.Socket.readyState == 1) {
            return "Are you sure you want to leave without logging out first?";
        }
    };
    After.Temp.W = document.documentElement.clientWidth;
    After.Temp.H = document.documentElement.clientHeight;
    $(window).on("resize", function (e) {
        After.Temp.W = document.documentElement.clientWidth;
        After.Temp.H = document.documentElement.clientHeight;
    });
    
    $(window).on("touchstart", function (event) {
        if (event.touches.length > 2) {
            if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            }
            else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen();
            }
            else if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }
            else if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            }
            else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            };
        };
    });
    After.Connection.SetHandlers();
    After.Temp.Splash.Init();
});