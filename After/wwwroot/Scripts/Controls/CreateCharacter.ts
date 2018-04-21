After.Temp = After.Temp || {};
After.Temp.CreateCharacter = After.Temp.CreateCharacter || {};
After.Temp.CreateCharacter.Init = function () {
    var ATI = After.Temp.Intro || {};
    ATI.SoulColor = "gray";


    ATI.EvaluateColor = function () {
        ($("#selectColor")[0] as HTMLSelectElement).selectedIndex = 0;
        while (Number($("#inputRed").val()) + Number($("#inputGreen").val()) + Number($("#inputBlue").val()) < 125) {
            ($("#inputRed")[0] as HTMLInputElement).value = String(Number(($("#inputRed")[0] as HTMLInputElement).value) + 1);
            ($("#inputGreen")[0] as HTMLInputElement).value = String(Number(($("#inputGreen")[0] as HTMLInputElement).value) + 1);
            ($("#inputBlue")[0] as HTMLInputElement).value = String(Number(($("#inputBlue")[0] as HTMLInputElement).value) + 1);
        }
        ATI.SoulColor = "rgb(" + $("#inputRed").val() + ", " + $("#inputGreen").val() + ", " + $("#inputBlue").val() + ")";
        // TODO: Change eye color.
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
                After.Audio.StopStreamLoop();
                ATI.ShowFlybys = false;
                $.get("/Controls/CreateAccount.html", function (data) {
                    $(document.body).append(data);
                });
            };
            After.Audio.StreamLoop("/Assets/Sounds/ceich93__drone-darkemptiness.mp3");
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