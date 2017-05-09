var After;
(function (After) {
    var Models;
    (function (Models) {
        var App;
        (function (App) {
            class Me {
                constructor() {
                    this.IsCharging = false;
                    this.IsMoving = false;
                    this.Particles = new Array();
                    this.Height = 1;
                    this.Powers = new Array();
                    var top = 0;
                    var left = 0;
                    this.ParticleBounds = {
                        left: 0,
                        top: 0,
                        right: 20,
                        bottom: 20
                    };
                    this.ParticleWanderTo = {
                        x: 0,
                        y: 0
                    };
                }
                get CurrentXYZ() {
                    if (this.XCoord == null || this.YCoord == null || this.ZCoord == null) {
                        return null;
                    }
                    return this.XCoord.toString() + "," + this.YCoord.toString() + "," + this.ZCoord;
                }
                ;
                set CurrentXYZ(XYZ) {
                    if (XYZ == null) {
                        this.XCoord = null;
                        this.YCoord = null;
                        this.ZCoord = null;
                        return;
                    }
                    var locArray = XYZ.split(",");
                    this.XCoord = Number(locArray[0]);
                    this.YCoord = Number(locArray[1]);
                    this.ZCoord = locArray[2];
                }
                ;
                get CoreEnergy() {
                    return Number($("#divCoreEnergy").text());
                }
                set CoreEnergy(value) {
                    $("#divCoreEnergy").text(value);
                }
                get CurrentEnergy() {
                    return Number($("#divEnergyAmount").text());
                }
                ;
                set CurrentEnergy(value) {
                    $("#divEnergyAmount").text(value);
                    $("#svgEnergy").css("width", (After.Me.CurrentEnergy / After.Me.MaxEnergy * 100) + "%");
                }
                ;
                get MaxEnergyModifier() {
                    return Number($("#divEnergyMod").text());
                }
                set MaxEnergyModifier(value) {
                    $("#divEnergyMod").text(value);
                }
                get CurrentCharge() {
                    return Number($("#divChargeAmount").text());
                }
                ;
                set CurrentCharge(value) {
                    $("#divChargeAmount").text(value);
                    $("#svgCharge").css("width", (After.Me.CurrentCharge / After.Me.MaxCharge * 100) + "%");
                }
                ;
                get MaxChargeModifier() {
                    return Number($("#divChargeMod").text());
                }
                set MaxChargeModifier(value) {
                    $("#divChargeMod").text(value);
                }
                get CurrentWillpower() {
                    return Number($("#divWillpowerAmount").text());
                }
                ;
                set CurrentWillpower(value) {
                    $("#divWillpowerAmount").text(value);
                    $("#svgWillpower").css("width", (After.Me.CurrentWillpower / After.Me.MaxWillpower * 100) + "%");
                }
                ;
                get MaxWillpowerModifier() {
                    return Number($("#divWillpowerMod").text());
                }
                set MaxWillpowerModifier(value) {
                    $("#divWillpowerMod").text(value);
                }
                // *** Event Functions *** //
                StartCharging() {
                    var request = {
                        "Category": "Events",
                        "Type": "StartCharging",
                        "Username": After.Me.Name,
                    };
                    After.Connection.Socket.send(JSON.stringify(request));
                }
                ;
                ToggleCharging() {
                    var request = {
                        "Category": "Events",
                        "Username": After.Me.Name,
                    };
                    if (After.Me.IsCharging) {
                        request.Type = "StopCharging";
                    }
                    else {
                        request.Type = "StartCharging";
                    }
                    After.Connection.Socket.send(JSON.stringify(request));
                }
                ;
                Move(strDirection) {
                    var request = {
                        "Category": "Events",
                        "Type": "PlayerMove",
                        "Direction": strDirection.toUpperCase()
                    };
                    After.Connection.Socket.send(JSON.stringify(request));
                }
                //*** Utility Functions ***//
                GetCurrentLocation() {
                    return After.World_Data.Areas.find((value) => { return value.StorageID == After.Me.CurrentXYZ; });
                }
            }
            App.Me = Me;
        })(App = Models.App || (Models.App = {}));
    })(Models = After.Models || (After.Models = {}));
})(After || (After = {}));
