var After;
(function (After) {
    var Controls;
    (function (Controls) {
        Controls.Game = {
            Init: function () {
                After.Temp = {};
                $("#divLogin").animate({ opacity: 0 }, 1000, function () {
                    $("#divLogin").hide();
                    $.get("/Controls/Game.html", function (data) {
                        $(document.body).append(data);
                        var spanMessage = document.createElement("span");
                        spanMessage.style.color = "whitesmoke";
                        spanMessage.innerHTML = "Welcome to After!<br/><br/>This game is in the beginning stages of development.  Check out the dev blog for updates!";
                        $("#divChatMessageWindow").append(spanMessage);
                        $("#divChatMessageWindow").append("<br/>");
                        After.Controls.Game.Load();
                    });
                });
            },
            Load: function () {
                $("#viewport").attr("content", "width=device-width, user-scalable=no, initial-scale=0.75, maximum-scale=0.75");
                After.Canvas.Element = document.getElementById("canvasMap");
                After.Canvas.Context2D = After.Canvas.Element.getContext("2d");
                After.Canvas.Element.width = document.documentElement.clientWidth;
                After.Canvas.Element.height = document.documentElement.clientHeight;
                $("#divGame").animate({ opacity: 1 }, 1000);
                $("#divLogin").remove();
                $("#divIntro").remove();
                $("#divCreateAccount").remove();
                if (After.Debug) {
                    $("#divDebug").show();
                }
                After.Input.SetInputHandlers();
                After.Game.PositionSideTabs();
                var query = {
                    "Category": "Queries",
                    "Type": "FirstLoad"
                };
                After.Connection.Socket.send(JSON.stringify(query));
            }
        };
    })(Controls = After.Controls || (After.Controls = {}));
})(After || (After = {}));
