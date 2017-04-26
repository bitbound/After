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
            //After.Me.CurrentXYZ = JsonMessage.Soul.CurrentXYZ;
            //After.Me.XCoord = JsonMessage.Soul.XCoord;
            //After.Me.YCoord = JsonMessage.Soul.YCoord;
            //After.Me.ZCoord = JsonMessage.Soul.ZCoord;
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
        if (JsonMessage.Soul.CharacterID == After.Me.CharacterID) {
            //After.Me.CurrentXYZ = null;
            //After.Me.XCoord = null;
            //After.Me.YCoord = null;
            //After.Me.ZCoord = null;
        }
        else
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
            //$(After.Me).animate({ XCoord: Number(dest[0]) }, Number(JsonMessage.TravelTime));
            //$(After.Me).animate({ YCoord: Number(dest[1]) }, Number(JsonMessage.TravelTime));
            After.Utilities.Animate(After.Me, "XCoord", After.Me.XCoord, Number(dest[0]), Number(JsonMessage.TravelTime));
            After.Utilities.Animate(After.Me, "YCoord", After.Me.YCoord, Number(dest[1]), Number(JsonMessage.TravelTime));
        }
        else {
            
        }
    }
}