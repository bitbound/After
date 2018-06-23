After.Temp = After.Temp || {};
After.Temp.CreateCharacter = After.Temp.CreateCharacter || {};
After.Temp.CreateCharacter.Init = function () {
    var ATI = After.Temp.Intro || {};
    ATI.SoulColor = "gray";
    ATI.EvaluateColor = function () {
        $("#selectColor")[0].selectedIndex = 0;
        while (Number($("#inputRed").val()) + Number($("#inputGreen").val()) + Number($("#inputBlue").val()) < 125) {
            $("#inputRed")[0].value = String(Number($("#inputRed")[0].value) + 1);
            $("#inputGreen")[0].value = String(Number($("#inputGreen")[0].value) + 1);
            $("#inputBlue")[0].value = String(Number($("#inputBlue")[0].value) + 1);
        }
        ATI.SoulColor = "rgb(" + $("#inputRed").val() + ", " + $("#inputGreen").val() + ", " + $("#inputBlue").val() + ")";
        $(".iris-color").css("stop-color", ATI.SoulColor);
    };
    ATI.SubmitColor = function () {
        After.Me.Color = ATI.SoulColor;
        $.when($("#divCreateCharacter").children("div").animate({ opacity: 0 }, 1000)).then(function () {
            $("#divCreateCharacter").remove();
            document.getElementById("buttonSkip").onclick = function () {
                $("#divIntro").hide();
                After.Audio.StopLoop();
                $.get("/Controls/CreateAccount.html", function (data) {
                    $(document.body).append(data);
                });
            };
            After.Audio.PlayLoop("/Assets/Sounds/ceich93__drone-darkemptiness.mp3", true, null);
            ATI.CurrentPosition = 6;
            ATI.IsPaused = false;
            $("#divNarration").html("");
            $("#divIntro").show();
            ATI.Narrate();
        });
    };
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
        $(".iris-color").css("stop-color", ATI.SoulColor);
    };
    ATI.Blink = function () {
        $(".eye-lid").animate({
            "height": "30px"
        }, 500, function () {
            $(".eye-lid").animate({
                "height": "0"
            }, 500);
        });
        var waitTime = Math.random() * 3000 + 1500;
        window.setTimeout(function () {
            if ($(".eye-lid").length > 0) {
                ATI.Blink();
            }
        }, waitTime);
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
    ATI.Blink();
};
//# sourceMappingURL=CreateCharacter.js.map