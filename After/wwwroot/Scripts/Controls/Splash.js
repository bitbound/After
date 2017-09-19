After.Temp = After.Temp || {};
After.Temp.Splash = {
    RaiseParticle: function () {
        try {
            var rectList = document.getElementById("imgTunnel").getBoundingClientRect();
            var riseHeight = $("#imgTunnel").height() * .8;
            var randomLeft = Math.random() * ($("#imgTunnel").width() * .20) + ($("#imgTunnel").width() * .25);
            var startLeft = Math.round(randomLeft + rectList.left);
            var startTop = Math.round(rectList.top + $("#imgTunnel").height() * .45);
            var part = document.createElement("div");
            $(part).css({
                height: "1px",
                width: "1px",
                left: startLeft,
                top: startTop,
                "border-radius": "100%",
                position: "absolute",
                "background-color": "black"
            });
            document.getElementById("divEffects").appendChild(part);
            $(part).animate({
                height: "6px",
                width: "6px",
                "top": "-=" + riseHeight,
                "opacity": "0",
                "background-color": "gray"
            }, 3000, function () {
                $(part).remove();
            });
            window.setTimeout(function () {
                if ($("#divSplash").length > 0) {
                    After.Temp.Splash.RaiseParticle();
                }
            }, 100);
        }
        catch (ex) { }
    },
    Init: function () {
        $.get("/Controls/Splash.html", function (data) {
            $(document.body).append(data);
            $(document.body).one("click", function () {
                $("#divLoadingFrame").remove();
                $("img").css("opacity", 1);
                After.Temp.Splash.Skipped = true;
                After.Temp.Splash.RaiseParticle();
            });
            $('#imgPlay').click(function () {
                $("#divSplash").fadeOut('slow', function () {
                    $("#divSplash").remove();
                    After.Audio.StopStreamLoop();
                    After.Temp.Login.Init();
                });
            });
            After.Audio.StreamLoop("/Assets/Sounds/ceich93_drone-ominousdistortion.mp3");
            if ($("#divSplash").length == 0) {
                After.Audio.StopStreamLoop();
            }
            $('#imgTitle').animate({ opacity: "1" }, 2000, function () {
                if (!After.Temp.Splash.Skipped) {
                    After.Temp.Splash.RaiseParticle();
                }
                $('#imgTunnel').animate({ opacity: "1" }, 2000, function () {
                    $('#imgTunnel').addClass("glowing");
                    $('#imgPlay').animate({ opacity: "1" }, 2000);
                    $('#imgBlog').animate({ opacity: "1" }, 2000, function () {
                    });
                });
            });
        });
    }
};
