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
    };
    export function HandleStopCharging(JsonMessage) {
        $("#buttonCharge").removeAttr("disabled");
        After.Me.IsCharging = false;
    };
    export function HandleCharacterArrives(JsonMessage) {
        if (JsonMessage.Soul.Name == After.Me.Name) {
            After.Me.CurrentXYZ = JsonMessage.Soul.CurrentXYZ;
            var query = {
                "Category": "Queries",
                "Type": "RefreshView"
            };
            After.Connection.Socket.send(JSON.stringify(query));
        }
        else {
            After.Storage.Souls.push(JsonMessage.Soul);
            var index = After.Storage.Areas.findIndex((value, index) => {
                return value.StorageID == JsonMessage.Soul.CurrentXYZ;
            });
            After.Storage.Areas[index].Occupants.push(JsonMessage.Soul.Name);
            if (JsonMessage.Soul.CurrentXYZ == After.Me.CurrentXYZ) {
                After.Game.AddChatMessage(JsonMessage.Soul.Name + " has arrived.", "whitesmoke");
            }
        }
    };
    export function HandleCharacterLeaves(JsonMessage) {
        if (JsonMessage.Soul.Name != After.Me.Name) 
        {
            var soulIndex = After.Storage.Souls.findIndex((value, index) => {
                return value.Name == JsonMessage.Soul.Name;
            });

            var areaIndex = After.Storage.Areas.findIndex((value, index) => {
                return value.StorageID == JsonMessage.Soul.CurrentXYZ;
            });
            var occupantIndex = After.Storage.Areas[areaIndex].Occupants.findIndex((value) => {
                return value == JsonMessage.Soul.Name;
            });
            After.Storage.Areas[areaIndex].Occupants.splice(occupantIndex, 1);
            
            After.Storage.Souls.splice(soulIndex, 1);
            if (JsonMessage.Soul.CurrentXYZ == After.Me.CurrentXYZ) {
                After.Game.AddChatMessage(JsonMessage.Soul.Name + " has left.", "whitesmoke");
            }
        }
    };
    export async function HandlePlayerMove(JsonMessage) {
        if (JsonMessage.Soul.Name == After.Me.Name) {
            After.Me.IsMoving = true;
            var dest = JsonMessage.To.split(",");
            var from = JsonMessage.From.split(",");
            $(After.Me).animate({
                "XCoord": Number(dest[0]),
                "YCoord": Number(dest[1])
            }, Number(JsonMessage.TravelTime));
            for (var i = 0; i < After.Me.Particles.length; i++) {
                var x = After.Utilities.GetRandom(-5, 5, true);
                var y = After.Utilities.GetRandom(-5, 5, true);
                After.Me.Particles[i].FromX = x;
                After.Me.Particles[i].ToX = x;
                After.Me.Particles[i].FromY = y;
                After.Me.Particles[i].ToY = y;
                $(After.Me.Particles[i]).animate({
                    "CurrentX": x,
                    "CurrentY": y
                }, Number(JsonMessage.TravelTime), function () {
                    After.Me.IsMoving = false;
                })
            }
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
                var part = new After.Models.FreeParticle();
                part.Color = JsonMessage.Soul.Color;
                var from = JsonMessage.From.split(",");
                var dest = JsonMessage.To.split(",");
                part.XCoord = Utilities.GetRandom(Number(from[0]) + .25, Number(from[0]) + .75, false);
                part.YCoord = Utilities.GetRandom(Number(from[1]) + .25, Number(from[1]) + .50, false);
                part.ZCoord = from[3];
                After.Storage.FreeParticles.push(part);
                $(part).animate({
                    "XCoord": Number(dest[0]) + .5,
                    "YCoord": Number(dest[1]) + .5
                }, Number(JsonMessage.TravelTime), function () {
                    var index = After.Storage.FreeParticles.findIndex((value) => value == part);
                    After.Storage.FreeParticles.splice(index, 1);
                });
            }
        }
    }
    export function HandleAreaCreated(JsonMessage) {
        After.Storage.Areas.push(JsonMessage.Area);
    }
    export function HandleAreaRemoved(JsonMessage) {
        var index = After.Storage.Areas.findIndex(area => area.StorageID == JsonMessage.Area.LocationID);
        if (index > -1) {
            After.Storage.Areas.splice(index, 1);
        }
    }
    export function HandleCharacterCharging(JsonMessage) {
        var location = JsonMessage.Location.split(",");
        var fp = new After.Models.FreeParticle();
        fp.Color = "white";
        fp.XCoord = Number(location[0]) + After.Utilities.GetRandom(0, .99, false);
        fp.YCoord = Number(location[1]) + After.Utilities.GetRandom(0, .99, false);
        fp.ZCoord = location[2];
        After.Storage.FreeParticles.push(fp);
        $(fp).animate({
            XCoord: Number(location[0]) + .5,
            YCoord: Number(location[1]) + .5
        }, 750, function () {
            var index = After.Storage.FreeParticles.findIndex(part => part == fp);
            After.Storage.FreeParticles.splice(index, 1);
        });
    }
}