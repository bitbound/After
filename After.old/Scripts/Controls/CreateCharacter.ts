After.Temp = After.Temp || {};
After.Temp.CreateCharacter = After.Temp.CreateCharacter || {};
After.Temp.CreateCharacter.Init = function () {
    var ATI = After.Temp.Intro || {};
    ATI.PreviewParticles = [];
    ATI.Flybys = [];
    ATI.canvasPreview = (document.getElementById("canvasPreview") as HTMLCanvasElement).getContext("2d");
    ATI.SoulColor = "gray";
    After.Temp.Intro.canvasPreview.canvas.width = $("#canvasPreview").width();
    After.Temp.Intro.canvasPreview.canvas.height = $("#canvasPreview").height();
    ATI.PreviewLeft = Math.round((ATI.canvasPreview.canvas.width / 2) - 50);
    ATI.PreviewTop = 0;
    var tempResize = function (e) {
        if ($("#divGame").is(":visible")) {
            $(window).off("resize", tempResize);
            return;
        }
        ATI.canvasPreview.canvas.width = $("#canvasPreview").width();
        ATI.PreviewLeft = Math.round((ATI.canvasPreview.canvas.width / 2) - 50);
        ATI.canvasPreview.canvas.height = $("#canvasPreview").height();
        if ($("#divCreateCharacter").is(":visible") == false) {
            ATI.PreviewTop = Math.round(ATI.canvasPreview.canvas.height * .25);
        }
    }
    $(window).on("resize", tempResize);
    for (var i = 0; i < 50; i++) {
        var part = <any>{};
        part.CurrentX = After.Utilities.GetRandom(ATI.PreviewLeft, ATI.PreviewLeft + 100, true);
        part.FromX = part.CurrentX;
        part.ToX = After.Utilities.GetRandom(ATI.PreviewLeft, ATI.PreviewLeft + 100, true);
        part.CurrentY = After.Utilities.GetRandom(ATI.PreviewTop, ATI.PreviewTop + 100, true);
        part.FromY = part.CurrentY;
        part.ToY = After.Utilities.GetRandom(ATI.PreviewTop, ATI.PreviewTop + 100, true);
        ATI.PreviewParticles.push(part);
        $(part).animate({
            "CurrentX": part.ToX,
            "CurrentY": part.ToY
        }, Math.abs(part.ToX - part.CurrentX) * 35);
    };
    ATI.EvaluateColor = function () {
        ($("#selectColor")[0] as HTMLSelectElement).selectedIndex = 0;
        while (Number($("#inputRed").val()) + Number($("#inputGreen").val()) + Number($("#inputBlue").val()) < 125) {
            ($("#inputRed")[0] as HTMLInputElement).value = String(Number(($("#inputRed")[0] as HTMLInputElement).value) + 1);
            ($("#inputGreen")[0] as HTMLInputElement).value = String(Number(($("#inputGreen")[0] as HTMLInputElement).value) + 1);
            ($("#inputBlue")[0] as HTMLInputElement).value = String(Number(($("#inputBlue")[0] as HTMLInputElement).value) + 1);
        }
        ATI.SoulColor = "rgb(" + $("#inputRed").val() + ", " + $("#inputGreen").val() + ", " + $("#inputBlue").val() + ")";
    };
    ATI.SubmitColor = function () {
        After.Me.Color = ATI.SoulColor;
        $.when($("#divCreateCharacter").children("div").animate({ opacity: 0 }, 1000)).then(function () {
            $("#divNarration").parent().css("top", "50%");
            $("#canvasPreview").css("margin", "0");
            $("#divIntro").prepend($("#canvasPreview"));
            $("#divCreateCharacter").remove();
            ATI.canvasPreview.canvas.width = $("#divLogin").innerWidth();
            ATI.canvasPreview.canvas.height = $("#divLogin").innerHeight() * .45;
            ATI.PreviewTop = Math.round(ATI.canvasPreview.canvas.height * .25);
            ATI.PreviewLeft = Math.round((ATI.canvasPreview.canvas.width / 2) - 50);
            document.getElementById("buttonSkip").onclick = function () {
                $("#divIntro").hide();
                After.Audio.LoopSource.stop();
                ATI.ShowFlybys = false;
                $.get("/Controls/CreateAccount.html", function (data) {
                    $(document.body).append(data);
                });
            };
            After.Audio.LoopSource.start();
            ATI.CurrentPosition = 6;
            ATI.IsPaused = false;
            $("#divNarration").html("");
            $("#divIntro").show();
            ATI.ShowFlybys = true;
            ATI.Narrate();
        });
    }
    ATI.ColorSelected = function () {
        if ($("#selectColor").val() == "") {
            $("#inputRed").val(125);
            $("#inputGreen").val(125);
            $("#inputBlue").val(125);
            return;
        }
        var hexColor = After.Utilities.ColorNameToHex($("#selectColor").val());
        var rgbColor = After.Utilities.HexToRGB(hexColor);
        ATI.SoulColor = rgbColor;
        $("#inputRed").val(rgbColor.replace("rgb(", "").split(",")[0]);
        $("#inputGreen").val(rgbColor.split(",")[1]);
        $("#inputBlue").val(rgbColor.replace(")", "").split(",")[2]);
    };

    ATI.PreviewInterval = window.setInterval(function () {
        var canvasPreview = ATI.canvasPreview;
        canvasPreview.save();
        canvasPreview.fillStyle = 'rgba(0,0,0, 0.2)';
        canvasPreview.fillRect(0, 0, canvasPreview.canvas.width, canvasPreview.canvas.height);
        if (ATI.ShowFlybys) {
            var roll = After.Utilities.GetRandom(0, 100, true);
            if (roll < 5) {
                var y = After.Utilities.GetRandom(0, ATI.canvasPreview.canvas.height, true);
                var fb = { "X": ATI.canvasPreview.canvas.width, "Y": y };
                ATI.Flybys.push(fb);
                $(fb).animate({
                    "X": -5,
                    "Y": y - 100
                }, 5000, "linear");
            }
            for (var i = 0; i < ATI.Flybys.length; i++) {
                if (typeof ATI.Flybys[i] == "undefined") {
                    continue;
                }
                ATI.canvasPreview.fillStyle = "whitesmoke";
                ATI.canvasPreview.beginPath();
                ATI.canvasPreview.arc(ATI.Flybys[i].X, ATI.Flybys[i].Y, 1, 0, Math.PI * 2);
                ATI.canvasPreview.fill();
                if (ATI.Flybys[i].X < 0 || ATI.Flybys[i].Y < 0) {
                    ATI.Flybys.splice(i, 1);
                }
            };
        }
        for (var i = 0; i < ATI.PreviewParticles.length; i++) {
            var part = ATI.PreviewParticles[i];

            if (part.ToX == part.CurrentX) {
                part.ToX = After.Utilities.GetRandom(ATI.PreviewLeft, ATI.PreviewLeft + 100, true);
                $(part).animate({
                    "CurrentX": part.ToX
                }, {
                    "duration": Math.abs(part.ToX - part.CurrentX) * 35,
                    "queue": false
                });
            }

            if (part.ToY == part.CurrentY) {
                part.ToY = part.ToY = After.Utilities.GetRandom(ATI.PreviewTop, ATI.PreviewTop + 100, true);
                $(part).animate({
                    "CurrentY": part.ToY
                }, {
                    "duration": Math.abs(part.ToY - part.CurrentY) * 35,
                    "queue": false
                });
            }

            canvasPreview.fillStyle = ATI.SoulColor;
            canvasPreview.beginPath();
            canvasPreview.arc(part.CurrentX, part.CurrentY, 2, 0, Math.PI * 2);
            canvasPreview.fill();
        }
    }, 25);

    document.getElementById("selectColor").appendChild(document.createElement("option"));
    After.Utilities.ColorNames.forEach(function (value, index) {
        var option = document.createElement("option");
        option.innerHTML = value;
        option.value = value;
        option.style.color = value;

        document.getElementById("selectColor").appendChild(option);
    });
    $("#divCreateCharacter").animate({ "opacity": "1" }, 1000);
}