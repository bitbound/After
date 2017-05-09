var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
            ;
            function HandleStopCharging(JsonMessage) {
                $("#buttonCharge").removeAttr("disabled");
                After.Me.IsCharging = false;
            }
            Events.HandleStopCharging = HandleStopCharging;
            ;
            function HandleCharacterArrives(JsonMessage) {
                if (JsonMessage.Soul.Name == After.Me.Name) {
                    After.Me.CurrentXYZ = JsonMessage.Soul.CurrentXYZ;
                    var query = {
                        "Category": "Queries",
                        "Type": "RefreshView"
                    };
                    After.Connection.Socket.send(JSON.stringify(query));
                }
                else {
                    After.World_Data.Souls.push(JsonMessage.Soul);
                    var index = After.World_Data.Areas.findIndex((value, index) => {
                        return value.StorageID == JsonMessage.Soul.CurrentXYZ;
                    });
                    After.World_Data.Areas[index].Occupants.push(JsonMessage.Soul.Name);
                    if (JsonMessage.Soul.CurrentXYZ == After.Me.CurrentXYZ) {
                        After.Game.AddChatMessage(JsonMessage.Soul.Name + " has arrived.", "whitesmoke");
                    }
                }
            }
            Events.HandleCharacterArrives = HandleCharacterArrives;
            ;
            function HandleCharacterLeaves(JsonMessage) {
                if (JsonMessage.Soul.Name != After.Me.Name) {
                    var soulIndex = After.World_Data.Souls.findIndex((value, index) => {
                        return value.Name == JsonMessage.Soul.Name;
                    });
                    var areaIndex = After.World_Data.Areas.findIndex((value, index) => {
                        return value.StorageID == JsonMessage.Soul.CurrentXYZ;
                    });
                    var occupantIndex = After.World_Data.Areas[areaIndex].Occupants.findIndex((value) => {
                        return value == JsonMessage.Soul.Name;
                    });
                    After.World_Data.Areas[areaIndex].Occupants.splice(occupantIndex, 1);
                    After.World_Data.Souls.splice(soulIndex, 1);
                    if (JsonMessage.Soul.CurrentXYZ == After.Me.CurrentXYZ) {
                        After.Game.AddChatMessage(JsonMessage.Soul.Name + " has left.", "whitesmoke");
                    }
                }
            }
            Events.HandleCharacterLeaves = HandleCharacterLeaves;
            ;
            function HandlePlayerMove(JsonMessage) {
                return __awaiter(this, void 0, void 0, function* () {
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
                            });
                        }
                        if (After.Settings.FollowPlayer) {
                            for (var i = 0; i < Number(JsonMessage.TravelTime); i = i + 20) {
                                window.setTimeout(function () {
                                    After.Canvas.CenterOnCoords(After.Me.XCoord, After.Me.YCoord, false, false);
                                }, i);
                            }
                        }
                    }
                    else {
                        for (var i = 0; i < 50; i++) {
                            var part = new After.Models.Game.FreeParticle();
                            part.Color = JsonMessage.Soul.Color;
                            var from = JsonMessage.From.split(",");
                            var dest = JsonMessage.To.split(",");
                            part.XCoord = After.Utilities.GetRandom(Number(from[0]) + .25, Number(from[0]) + .75, false);
                            part.YCoord = After.Utilities.GetRandom(Number(from[1]) + .25, Number(from[1]) + .50, false);
                            part.ZCoord = from[3];
                            After.World_Data.FreeParticles.push(part);
                            $(part).animate({
                                "XCoord": Number(dest[0]) + .5,
                                "YCoord": Number(dest[1]) + .5
                            }, Number(JsonMessage.TravelTime), function () {
                                var index = After.World_Data.FreeParticles.findIndex((value) => value == part);
                                After.World_Data.FreeParticles.splice(index, 1);
                            });
                        }
                    }
                });
            }
            Events.HandlePlayerMove = HandlePlayerMove;
            function HandleAreaCreated(JsonMessage) {
                After.World_Data.Areas.push(JsonMessage.Area);
            }
            Events.HandleAreaCreated = HandleAreaCreated;
            function HandleAreaRemoved(JsonMessage) {
                var index = After.World_Data.Areas.findIndex(area => area.StorageID == JsonMessage.Area.LocationID);
                if (index > -1) {
                    After.World_Data.Areas.splice(index, 1);
                }
            }
            Events.HandleAreaRemoved = HandleAreaRemoved;
            function HandleCharacterCharging(JsonMessage) {
                var location = JsonMessage.Location.split(",");
                var fp = new After.Models.Game.FreeParticle();
                fp.Color = "white";
                fp.XCoord = Number(location[0]) + After.Utilities.GetRandom(0, .99, false);
                fp.YCoord = Number(location[1]) + After.Utilities.GetRandom(0, .99, false);
                fp.ZCoord = location[2];
                After.World_Data.FreeParticles.push(fp);
                $(fp).animate({
                    XCoord: Number(location[0]) + .5,
                    YCoord: Number(location[1]) + .5
                }, 750, function () {
                    var index = After.World_Data.FreeParticles.findIndex(part => part == fp);
                    After.World_Data.FreeParticles.splice(index, 1);
                });
            }
            Events.HandleCharacterCharging = HandleCharacterCharging;
        })(Events = Message_Handlers.Events || (Message_Handlers.Events = {}));
    })(Message_Handlers = After.Message_Handlers || (After.Message_Handlers = {}));
})(After || (After = {}));
