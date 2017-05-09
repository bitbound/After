namespace After.Models.App {
    export class Me {
        constructor() {
            this.IsCharging = false;
            this.IsMoving = false;
            this.Particles = new Array<After.Models.Game.Particle>();
            this.Height = 1;
            this.Powers = new Array<After.Models.Game.Power>();
            var top = 0;
            var left = 0;
            this.ParticleBounds = {
                left: 0,
                top: 0,
                right: 20,
                bottom: 20
            }
            this.ParticleWanderTo = {
                x: 0,
                y: 0
            }
        }
        Name: string;
        Color: string;
        get CurrentXYZ() {
            if (this.XCoord == null || this.YCoord == null || this.ZCoord == null) {
                return null;
            }
            return this.XCoord.toString() + "," + this.YCoord.toString() + "," + this.ZCoord;
        };
        set CurrentXYZ(XYZ: string) {
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
        };
        XCoord: number;
        YCoord: number;
        ZCoord: string;
        IsCharging: boolean;
        IsMoving: boolean;
        get CoreEnergy() {
            return Number($("#divCoreEnergy").text());
        }
        set CoreEnergy(value: number) {
            $("#divCoreEnergy").text(value);
        }
        CoreEnergyPeak: number;
        get CurrentEnergy() {
            return Number($("#divEnergyAmount").text());
        };
        set CurrentEnergy(value: number) {
            $("#divEnergyAmount").text(value);
            $("#svgEnergy").css("width", (After.Me.CurrentEnergy / After.Me.MaxEnergy * 100) + "%");
        };
        MaxEnergy: number;
        get MaxEnergyModifier() {
            return Number($("#divEnergyMod").text());
        }
        set MaxEnergyModifier(value: number) {
            $("#divEnergyMod").text(value);
        }
        get CurrentCharge() {
            return Number($("#divChargeAmount").text());
        };
        set CurrentCharge(value: number) {
            $("#divChargeAmount").text(value);
            $("#svgCharge").css("width", (After.Me.CurrentCharge / After.Me.MaxCharge * 100) + "%");
        };
        MaxCharge: number;
        get MaxChargeModifier() {
            return Number($("#divChargeMod").text());
        }
        set MaxChargeModifier(value: number) {
            $("#divChargeMod").text(value);
        }
        get CurrentWillpower() {
            return Number($("#divWillpowerAmount").text());
        };
        set CurrentWillpower(value: number) {
            $("#divWillpowerAmount").text(value);
            $("#svgWillpower").css("width", (After.Me.CurrentWillpower / After.Me.MaxWillpower * 100) + "%");
        };
        MaxWillpower: number;
        get MaxWillpowerModifier() {
            return Number($("#divWillpowerMod").text());
        }
        set MaxWillpowerModifier(value: number) {
            $("#divWillpowerMod").text(value);
        }
        ViewDistance: number;
        Powers: Array<After.Models.Game.Power>;

        // *** Visual Properties Only ***//
        Height: number;
        ParentBounds: {
            top: number,
            right: number,
            bottom: number,
            left: number
        };
        Particles: Array<After.Models.Game.Particle>;
        ParticleInterval: number;
        ParticleBounds: {
            top: number,
            right: number,
            bottom: number,
            left: number
        };
        ParticleWanderTo: {
            x: number,
            y: number
        }

        // *** Event Functions *** //
        StartCharging() {
            var request = {
                "Category": "Events",
                "Type": "StartCharging",
                "Username": After.Me.Name,
            };
            After.Connection.Socket.send(JSON.stringify(request));
        };
        ToggleCharging() {
            var request = <any>{
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
        };
        Move(strDirection: string) {
            var request = {
                "Category": "Events",
                "Type": "PlayerMove",
                "Direction": strDirection.toUpperCase()
            };
            After.Connection.Socket.send(JSON.stringify(request));
        }

        //*** Utility Functions ***//
        GetCurrentLocation() :After.Models.Game.Area {
            return After.World_Data.Areas.find((value) => { return value.StorageID == After.Me.CurrentXYZ; });
        }
    }
}