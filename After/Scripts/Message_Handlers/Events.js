var After;
(function (After) {
    var Message_Handlers;
    (function (Message_Handlers) {
        var Events;
        (function (Events) {
            function HandleStartCharging(JsonMessage) {
                $("#buttonCharge").removeAttr("disabled");
                if (JsonMessage.Result == "ok") {
                    After.Me.IsCharging = true;
                    $('#divButtonCharge').hide();
                    $('#divCharge').show();
                    if (After.Temp.ChargeInterval != undefined) {
                        window.clearInterval(After.Temp.ChargeInterval);
                    }
                    After.Temp.ChargeInterval = window.setInterval(function () {
                        if (After.Me.IsCharging == false) {
                            if (After.Me.CurrentCharge == 0) {
                                $('#divButtonCharge').show();
                                $('#divCharge').hide();
                                window.clearInterval(After.Temp.ChargeInterval);
                            }
                            return;
                        }
                        var divRect = document.getElementById("divCharge").getBoundingClientRect();
                        var riseHeight = $("#divCharge").height() * .8;
                        var chargePercent = After.Me.CurrentCharge / After.Me.MaxCharge;
                        var startLeft = After.Utilities.GetRandom($("#divCharge").width() * .15, $("#divCharge").width() * .85, true);
                        var startTop = $("#divCharge").height() * .5;
                        var part = document.createElement("div");
                        part.classList.add("particle");
                        part.classList.add("anim-charge-button");
                        $(part).css({
                            left: startLeft,
                            top: startTop,
                        });
                        $("#divCharge").append(part);
                        window.setTimeout(function (thisParticle) {
                            $(thisParticle).remove();
                        }, 1000, part);
                    }, 100);
                }
                // TODO: Else...
            }
            Events.HandleStartCharging = HandleStartCharging;
            function HandleStopCharging(JsonMessage) {
                $("#buttonCharge").removeAttr("disabled");
                After.Me.IsCharging = false;
            }
            Events.HandleStopCharging = HandleStopCharging;
            ;
            function HandleCharacterArrives(JsonMessage) {
                if (JsonMessage.Soul.CharacterID == After.Me.CharacterID) {
                }
                else {
                    var soul = After.Models.Game.Soul.Create(JsonMessage.Soul);
                    After.World_Data.Souls.push(soul);
                    if (soul.CurrentXYZ == After.Me.CurrentXYZ) {
                        After.Game.AddChatMessage(JsonMessage.Soul.Name + " has arrived.", "whitesmoke");
                    }
                }
            }
            Events.HandleCharacterArrives = HandleCharacterArrives;
            ;
            function HandleCharacterLeaves(JsonMessage) {
                if (JsonMessage.Soul.CharacterID == After.Me.CharacterID) {
                }
                else {
                    var index = After.World_Data.Souls.findIndex((value, index) => {
                        return value.CharacterID == JsonMessage.Soul.CharacterID;
                    });
                    After.World_Data.Souls.splice(index, 1);
                    if (JsonMessage.Soul.CurrentXYZ == After.Me.CurrentXYZ) {
                        After.Game.AddChatMessage(JsonMessage.Soul.Name + " has left.", "whitesmoke");
                    }
                }
            }
            Events.HandleCharacterLeaves = HandleCharacterLeaves;
            ;
            function HandlePlayerMove(JsonMessage) {
                if (JsonMessage.Soul.CharacterID == After.Me.CharacterID) {
                    var dest = JsonMessage.To.split(",");
                    //$(After.Me).animate({ XCoord: Number(dest[0]) }, Number(JsonMessage.TravelTime));
                    //$(After.Me).animate({ YCoord: Number(dest[1]) }, Number(JsonMessage.TravelTime));
                    After.Utilities.Animate(After.Me, "XCoord", After.Me.XCoord, Number(dest[0]), Number(JsonMessage.TravelTime));
                    After.Utilities.Animate(After.Me, "YCoord", After.Me.YCoord, Number(dest[1]), Number(JsonMessage.TravelTime));
                }
                else {
                }
            }
            Events.HandlePlayerMove = HandlePlayerMove;
        })(Events = Message_Handlers.Events || (Message_Handlers.Events = {}));
    })(Message_Handlers = After.Message_Handlers || (After.Message_Handlers = {}));
})(After || (After = {}));
//# sourceMappingURL=Events.js.map