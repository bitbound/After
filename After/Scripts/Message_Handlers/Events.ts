namespace After.Message_Handlers.Events {
    export function HandleStartCharging(JsonMessage) {
        $("#buttonCharge").removeAttr("disabled");
        if (JsonMessage.Result == "ok") {
            After.Me.IsCharging = true;
            $('#divButtonCharge').hide();
            $('#divCharge').show();
            if (After.Temp.ChargeInterval != undefined) {
                window.clearInterval(After.Temp.ChargeInterval);
            }
            After.Temp.ChargeInterval = window.setInterval(function() {
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
                window.setTimeout(function(thisParticle) {
                    $(thisParticle).remove();
                }, 1000, part);
            }, 100);
        }
        // TODO: Else...
    }
    export function HandleStopCharging(JsonMessage) {
        $("#buttonCharge").removeAttr("disabled");
        After.Me.IsCharging = false;
    };
    export function HandleCharacterArrives(JsonMessage) {
        if (JsonMessage.Soul.CharacterID == After.Me.CharacterID) {
            After.Me.CurrentXYZ = JsonMessage.Soul.CurrentXYZ;
            var query = {
                "Category": "Queries",
                "Type": "RefreshView"
            };
            After.Connection.Socket.send(JSON.stringify(query));
        }
        else {
            var soul = After.Models.Game.Soul.Create(JsonMessage.Soul);
            After.World_Data.Souls.push(soul);
            if (soul.CurrentXYZ == After.Me.CurrentXYZ) {
                After.Game.AddChatMessage(JsonMessage.Soul.Name + " has arrived.", "whitesmoke");
            }
        }
    };
    export function HandleCharacterLeaves(JsonMessage) {
        if (JsonMessage.Soul.CharacterID != After.Me.CharacterID) 
        {
            var index = After.World_Data.Souls.findIndex((value, index) => {
                return value.CharacterID == JsonMessage.Soul.CharacterID;
            })
            After.World_Data.Souls.splice(index, 1);
            if (JsonMessage.Soul.CurrentXYZ == After.Me.CurrentXYZ) {
                After.Game.AddChatMessage(JsonMessage.Soul.Name + " has left.", "whitesmoke");
            }
        }
    };
    export function HandlePlayerMove(JsonMessage) {
        if (JsonMessage.Soul.CharacterID == After.Me.CharacterID) {
            var dest = JsonMessage.To.split(",");
            var from = JsonMessage.From.split(",");
            After.Utilities.Animate(After.Me, "XCoord", Number(from[0]), Number(dest[0]), Number(JsonMessage.TravelTime));
            After.Utilities.Animate(After.Me, "YCoord", Number(from[1]), Number(dest[1]), Number(JsonMessage.TravelTime));
            if (After.Settings.FollowPlayer) {
                for (var i = 0; i < Number(JsonMessage.TravelTime); i = i + 20) {
                    window.setTimeout(function () {
                        After.Canvas.CenterOnCoords(After.Me.XCoord, After.Me.YCoord, false, false);
                    }, i)
                }
            }
        }
        else {
            for (var i = 0; i < 50; i++) {
                var part = new After.Models.Game.FreeParticle();
                part.Color = JsonMessage.Soul.Color;
                var from = JsonMessage.From.split(",");
                var dest = JsonMessage.To.split(",");
                part.XCoord = Utilities.GetRandom(Number(from[0]) + .25, Number(from[0]) + .75, false);
                part.YCoord = Utilities.GetRandom(Number(from[1]) + .25, Number(from[1]) + .50, false);
                part.ZCoord = from[3];
                window.setTimeout(function (part) {
                    After.World_Data.FreeParticles.push(part);
                    After.Utilities.Animate(part, "XCoord", part.XCoord, Number(dest[0]) + .5, Number(JsonMessage.TravelTime));
                    After.Utilities.Animate(part, "YCoord", part.YCoord, Number(dest[1]) + .5, Number(JsonMessage.TravelTime));
                    window.setTimeout(function (part) {
                        var index = After.World_Data.FreeParticles.findIndex((value) => value == part);
                        After.World_Data.FreeParticles.splice(index, 1);
                    }, Number(JsonMessage.TravelTime), part);
                }, i * 5, part)
            }
        }
    }
    export function HandleAreaCreated(JsonMessage) {
        After.World_Data.Areas.push(After.Models.Game.Area.Create(JsonMessage.Area));
    }
    export function HandleAreaRemoved(JsonMessage) {
        var index = After.World_Data.Areas.findIndex(area => area.LocationID == JsonMessage.Area.LocationID);
        if (index > -1) {
            After.World_Data.Areas.splice(index, 1);
        }
    }
}