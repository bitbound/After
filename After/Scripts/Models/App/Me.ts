namespace After.Models.App {
    export class Me {
        constructor() {
            this.IsCharging = false;
            this.IsMoving = false;
            this.Particles = new Array<After.Models.Game.Particle>();
            this.Height = 1;
        }
        CharacterID: number;
        Name: string;
        Color: string;
        get CurrentXYZ() {
            if (typeof this.XCoord == "undefined" || typeof this.YCoord == "undefined" || typeof this.ZCoord == "undefined") {
                return null;
            }
            return this.XCoord.toString() + "," + this.YCoord.toString() + "," + this.ZCoord;
        };
        set CurrentXYZ(XYZ: string) {
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
        CoreEnergy: number;
        CoreEnergyPeak: number;
        CurrentEnergy: number;
        MaxEnergy: number;
        MaxEnergyModifier: number;
        CurrentCharge: number;
        MaxCharge: number;
        MaxChargeModifier: number;
        CurrentWillpower: number;
        MaxWillpower: number;
        MaxWillpowerModifier: number;
        ViewDistance: number;

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

        // *** Functions *** //
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
    }
}