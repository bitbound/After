$(document).ready(function () {
    if (window.location.href.search("localhost") > -1) {
        After.Debug = true;
    };
    $(window).on("error", function (e) {
        var error = {
            Message: e.originalEvent.message,
            TimeStamp: e.originalEvent.timeStamp,
            Line: e.originalEvent.lineno,
            Column: e.originalEvent.colno,
            StackTrace: e.originalEvent.error.stack
        }
        $.post(window.location.origin + "/Services/ErrorReporting.cshtml", JSON.stringify(error));
        alert(e.originalEvent.message);
        throw e;
    });
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

    After.Temp.Login.Init();
});