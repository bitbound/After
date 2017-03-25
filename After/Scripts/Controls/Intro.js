After.Temp.Intro = After.Temp.Intro || {};
After.Temp.Intro.Start = function () {
    $.get("/Controls/Intro.html", function (data) {
        $(document.body).append(data);
        var ATI = After.Temp.Intro;
        $("#divLogin").animate({ opacity: 0 }, 1000, function () {
            $("#divLogin").hide();
            $("#divIntro").animate({ opacity: 1 }, 2000, function () {
                $("#svgRing1").animate({ opacity: 1 }, 1500);
                $("#svgRing2").animate({ opacity: 1 }, 1500, function () {
                    $("#svgSliver").show();
                    document.getElementById("audioTeleport").play();
                    $("#svgSliver").animate({ top: "20%" }, 500, function () {
                        window.setTimeout(function () {
                            $("#divPresents").animate({ opacity: 1 }, 2000, function () {
                                window.setTimeout(function () {
                                    $("#divLogo").animate({ opacity: 0 }, 1500, function () {
                                        $("#divLogo").remove();
                                        if (document.getElementById("audioHeartbeat") != null) {
                                            document.getElementById("audioHeartbeat").play();
                                            window.setTimeout(function () {
                                                ATI.Narrate();
                                                $("#buttonSkip").fadeIn();
                                            }, 1000)
                                        }
                                    });
                                }, 2000);
                            });
                        }, 1000);
                    });
                })
            });
        });
        ATI.CurrentPosition = ATI.CurrentPosition || 0;
        ATI.IsPaused = false;
        ATI.Interval = 0;
        ATI.Increasing = true;
        ATI.Skip = function () {
            $("#divIntro").hide();
            $("#divLogo").hide();
            document.getElementById("audioHeartbeat").pause();
            document.getElementById("audioHeartbeat").remove();
            $.get("/Controls/CreateCharacter.html", function (data) {
                $(document.body).append(data);
                After.Temp.CreateCharacter.Init();
            });
        };
        ATI.Narrate = function () {
            $("#divNarration").html("");
            window.setTimeout(function () {
                if (ATI.CurrentPosition == ATI.AllLines.length) {
                    $("#divIntro").hide();
                    document.getElementById("audioDarkEmpty").pause();
                    $.get("/Controls/CreateAccount.html", function (data) {
                        $(document.body).append(data);
                    });
                    return;
                }
                var narrateText = ATI.AllLines[ATI.CurrentPosition];
                for (var i = 0; i < narrateText.length; i++) {
                    var outerSpan = document.createElement("span");
                    var innerSpan = document.createElement("span");
                    outerSpan.appendChild(innerSpan);
                    innerSpan.style.opacity = 0;
                    innerSpan.innerText = narrateText.slice(i, i + 1);
                    innerSpan.style.position = "relative";
                    innerSpan.style.left = "25px";
                    $("#divNarration").append(outerSpan);
                };

                var animateText = function (outerSpan) {
                    if ($("#divIntro").is(":hidden")) {
                        return;
                    }
                    if (outerSpan.length == 0) {
                        ATI.IsPaused = true;
                        if ($("#divNarration").text().search("you realize that you've stopped moving") > -1) {
                            ATI.ShowFlybys = false;
                        };
                        $("#divIntro").click(function () {
                            ATI.IsPaused = false;
                            if ($("#divNarration").text().search("Your passing was") > -1) {
                                document.getElementById("audioHeartbeat").pause();
                                $("#divNarration").html("");
                                $("#divIntro").hide();
                                $.get("/Controls/CreateCharacter.html", function (data) {
                                    $(document.body).append(data);
                                    After.Temp.CreateCharacter.Init();
                                });
                            }
                            else {
                                ATI.Narrate();
                            }
                            $("#divIntro").off("click");
                        });
                        ATI.FlashContinue();
                        return;
                    }
                    $(outerSpan).children().first().addClass("animate-narration");
                    window.setTimeout(function () {
                        animateText($(outerSpan.next()));
                    }, 25);
                };
                animateText($("#divNarration").children().first());
                ATI.CurrentPosition++;
            }, 750);
        };
        ATI.FlashContinue = function () {
            ATI.Interval = window.setInterval(function () {
                var divC = document.getElementById("divContinue");
                if (ATI.IsPaused == false) {
                    $("#divContinue").css("opacity", "0");
                    window.clearInterval(ATI.Interval);
                    return;
                };
                if (ATI.Increasing) {
                    divC.style.opacity = parseFloat(divC.style.opacity) + .01;
                }
                else {
                    divC.style.opacity = parseFloat(divC.style.opacity) - .01;
                }
                if (parseFloat(divC.style.opacity) <= 0) {
                    ATI.Increasing = true;
                } else if (parseFloat(divC.style.opacity) >= 1) {
                    ATI.Increasing = false;
                }
            }, 5);
        };
        ATI.AllLines = ["They say your life flashes before your eyes when you die.",
                "You see your loved ones.  You revisit your most cherished memories.",
                "Everything that was good in your life, everything that fills your heart with joy and warmth, is there to ease you into what comes after.",
                "You feel an unwavering and comforting peace, and you know that all will be well.",
                "At least, that's what they say.",
                "Your passing was somewhat different.",
                "Your new life, your afterlife, had begun.  You didn't realize it yet, but it had.",
                "It started with a simple awareness, a faint sense of displacement that grew stronger once you recognized it.",
                "As you ponder this strange and disorienting feeling, rolling over it slowly with your mind, it suddenly hits you.",
                "You can't feel your body.",
                "Strangely unafraid, you realize that you no longer have a body.  You're certain of it.  You've left it behind, and you're now moving toward... somewhere else.",
                "Yes, that's it.  You remember now.  You died.  But how?  When?  The details aren't quite there yet, just out of reach from your awakening mind.",
                "That is exactly how it feels, you realize.  Like waking from a dream.  Only this time, instead of entering, you're leaving the world of the living as your mind begins to reassemble.",
                "Details begin springing up.  You see them, feel them, hear and smell them.",
                "You remember love.  Happiness.  Friends and family.  You hear their voices, feel their embraces.",
                "Memories wash over you.  They're vivid and almost tangible, yet there is no sorrow in knowing that you're moving on.",
                "As you start becoming comfortable with this foreign sense of disembodiment, with your former life playing like a slide show through your soul, you begin looking forward.",
                "You're moving toward... something.  But toward what?  Where are you?  You try to focus.",
                "You don't feel anything, at least not the way you used to.  But you have this unmistakable sense that you still somehow exist.",
                "You push against that feeling, awkwardly at first, striving to extend your consciousness.",
                "Just as you're beginning to gain a sense of stability, feeling outward with your mind, you're suddenly aware that your memories are dissipating.",
                "Right after experiencing them, they fade and vanish from your mind.  Forgotten.",
                "Panic clutches you.  You pull yourself inward, wrapping your consciousness around the memories streaming through you, trying to hold onto them.",
                "You quickly realize that it's hopeless.  Those glimpses of your life burn radiantly in your mind, then slowly drift away.",
                "You try to drink in every moment, every detail, but sorrow is welling up inside you.",
                "Every fading memory leaves behind an empty hole, a bleak reminder that you once had something precious there.",
                "You can't believe this is how it ends.  Will you really be left wondering, \"What was the point?\"",
                "Sorrow begins to be replaced by rage, boiling fresh and hot inside you.",
                "As you're about to reach out again with your mind, your anger fueling the need to find *something*, you realize that you've stopped moving.",
                "You cast out against your immediate area.  The act is starting to feel natural, but you still don't sense anything, so you can't be certain if you're actually doing anything at all.",
                "You try again, harder, as if pushing with all your might against unseen walls.  It feels like the area around you expands, the walls bending outward.",
                "Then briefly, you feel it.  A presence.  Something that distinctly contrasts all the nothingness.",
                "You push out again.  It's closer.",
                "As it approaches, you quickly try to take inventory of yourself.  What's left of you?  What do you remember?  How do you prepare for whatever approaches?",
                "You only have a moment to question, then it's upon you."];
    });
};