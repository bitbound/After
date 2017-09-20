var After;
(function (After) {
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
                return After.Storage.Areas.find((value) => { return value.StorageID == After.Me.CurrentXYZ; });
            }
            SyncParticleCoords() {
                After.Me.Particles.forEach(function (value, index) {
                    value.XCoord = After.Me.XCoord;
                    value.YCoord = After.Me.YCoord;
                });
            }
            BlowUp(Force) {
                for (var i = 0; i < After.Me.Particles.length - 1; i++) {
                    After.Me.Particles[i].XCoord = After.Utilities.GetRandom(-Force, Force, true);
                    After.Me.Particles[i].YCoord = After.Utilities.GetRandom(-Force, Force, true);
                }
            }
            WanderParticlesX() {
                var soul = After.Me;
                soul.ParticleWanderTo["x"] = After.Utilities.GetRandom(-25, 15, true);
                var duration = Math.abs(soul.ParticleBounds.left - soul.ParticleWanderTo.x) * 500;
                $(soul.ParticleBounds).animate({
                    "left": soul.ParticleWanderTo.x
                }, {
                    "duration": duration,
                    "queue": false,
                    "easing": "linear"
                });
                $(soul.ParticleBounds).animate({
                    "right": soul.ParticleWanderTo.x + 20
                }, {
                    "duration": duration,
                    "queue": false,
                    "easing": "linear"
                });
                window.setTimeout(function () {
                    After.Me.WanderParticlesX();
                }, duration);
            }
            WanderParticlesY() {
                var soul = After.Me;
                soul.ParticleWanderTo["y"] = After.Utilities.GetRandom(-30, -5, true);
                var duration = Math.abs(soul.ParticleBounds.top - soul.ParticleWanderTo.y) * 500;
                $(soul.ParticleBounds).animate({
                    "top": soul.ParticleWanderTo.y
                }, {
                    "duration": duration,
                    "queue": false,
                    "easing": "linear"
                });
                $(soul.ParticleBounds).animate({
                    "bottom": soul.ParticleWanderTo.y + 20
                }, {
                    "duration": duration,
                    "queue": false,
                    "easing": "linear"
                });
                window.setTimeout(function () {
                    After.Me.WanderParticlesY();
                }, duration);
            }
            MoveParticleX(Part) {
                var soul = After.Me;
                var pb = After.Me.ParticleBounds;
                Part.ToX = After.Utilities.GetRandom(pb.left, pb.right, true);
                var duration = Math.abs(Part.ToX - Part.CurrentX) * 125;
                $(Part).animate({
                    "CurrentX": Part.ToX
                }, {
                    "duration": duration,
                    "queue": false
                });
                window.setTimeout(function (Part) {
                    After.Me.MoveParticleX(Part);
                }, duration, Part);
            }
            MoveParticleY(Part) {
                var soul = After.Me;
                var pb = After.Me.ParticleBounds;
                Part.ToY = After.Utilities.GetRandom(pb.top, pb.bottom, true);
                var duration = Math.abs(Part.ToY - Part.CurrentY) * 125;
                $(Part).animate({
                    "CurrentY": Part.ToY
                }, {
                    "duration": duration,
                    "queue": false
                });
                window.setTimeout(function (Part) {
                    After.Me.MoveParticleY(Part);
                }, duration, Part);
            }
        }
        App.Me = Me;
    })(App = After.App || (After.App = {}));
})(After || (After = {}));
