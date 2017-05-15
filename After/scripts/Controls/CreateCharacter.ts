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
        var canPre = document.getElementById("canvasPreview");
        var part = <any>{};
        part.CurrentX = After.Utilities.GetRandom(ATI.PreviewLeft, ATI.PreviewLeft + 100, true);
        part.FromX = part.CurrentX;
        part.ToX = After.Utilities.GetRandom(ATI.PreviewLeft, ATI.PreviewLeft + 100, true);
        part.CurrentY = After.Utilities.GetRandom(ATI.PreviewTop, ATI.PreviewTop + 100, true);
        part.FromY = part.CurrentY;
        part.ToY = After.Utilities.GetRandom(ATI.PreviewTop, ATI.PreviewTop + 100, true);
        ATI.PreviewParticles.push(part);
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
                ATI.Flybys.push({ "X": ATI.canvasPreview.canvas.width, "Y": After.Utilities.GetRandom(0, ATI.canvasPreview.canvas.height, true) });
            }
            for (var i = 0; i < ATI.Flybys.length; i++) {
                ATI.canvasPreview.fillStyle = "whitesmoke";
                ATI.canvasPreview.beginPath();
                ATI.canvasPreview.arc(ATI.Flybys[i].X, ATI.Flybys[i].Y, 1, 0, Math.PI * 2);
                ATI.canvasPreview.fill();
                ATI.Flybys[i].X -= 5;
                ATI.Flybys[i].Y -= .5;
                if (ATI.Flybys[i].X < 0 || ATI.Flybys[i].Y < 0) {
                    ATI.Flybys.splice(i, 1);
                }
            };
        }
        for (var i = 0; i < ATI.PreviewParticles.length; i++) {
            var part = ATI.PreviewParticles[i];
            if (part.ToX >= part.FromX && part.CurrentX >= part.ToX) {
                part.FromX = part.ToX;
                do {
                    part.ToX = After.Utilities.GetRandom(ATI.PreviewLeft, ATI.PreviewLeft + 100, true);
                } while (part.FromX == part.ToX);
            } else if (part.ToX <= part.FromX && part.CurrentX <= part.ToX) {
                part.FromX = part.ToX;
                do {
                    part.ToX = After.Utilities.GetRandom(ATI.PreviewLeft, ATI.PreviewLeft + 100, true);
                } while (part.FromX == part.ToX);
            }
            if (part.ToY >= part.FromY && part.CurrentY >= part.ToY) {
                part.FromY = part.ToY;
                do {
                    part.ToY = After.Utilities.GetRandom(ATI.PreviewTop, ATI.PreviewTop + 100, true);
                } while (part.FromY == part.ToY);
            } else if (part.ToY <= part.FromY && part.CurrentY <= part.ToY) {
                part.FromY = part.ToY;
                do {
                    part.ToY = After.Utilities.GetRandom(ATI.PreviewTop, ATI.PreviewTop + 100, true);
                } while (part.FromY == part.ToY);
            }

            var halfwayX = (Math.max(part.FromX, part.ToX) - Math.min(part.FromX, part.ToX)) / 2;
            var travelledX = Math.max(part.FromX, part.CurrentX) - Math.min(part.FromX, part.CurrentX);
            var distanceFromEndX = halfwayX - Math.abs(halfwayX - travelledX);
            var changeX = .25 + (distanceFromEndX / halfwayX * 2);
            if (part.ToX > part.CurrentX) {
                part.CurrentX += changeX;
            } else if (part.ToX < part.CurrentX) {
                part.CurrentX -= changeX;
            };
            if (isFinite(part.CurrentX) == false) {
                part.CurrentX = part.ToX;
            }

            var halfwayY = (Math.max(part.FromY, part.ToY) - Math.min(part.FromY, part.ToY)) / 2;
            var travelledY = Math.max(part.FromY, part.CurrentY) - Math.min(part.FromY, part.CurrentY);
            var distanceFromEndY = halfwayY - Math.abs(halfwayY - travelledY);
            var changeY = .25 + (distanceFromEndY / halfwayY * 2);
            if (part.ToY > part.CurrentY) {
                part.CurrentY += changeY;
            } else if (part.ToY < part.CurrentY) {
                part.CurrentY -= changeY;
            };
            if (isFinite(part.CurrentY) == false) {
                part.CurrentY = part.ToY;
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