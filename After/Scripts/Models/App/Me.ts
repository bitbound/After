namespace After.Models.App {
    export class Me {
        constructor() {
            this.IsCharging = false;
            this.IsMoving = false;
        }
        Name: string;
        Color: string;
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
        CurrentLocation: {};

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
        UpdateStatsUI() {
            $("#divEnergyAmount").text(After.Me.CurrentEnergy);
            $("#divChargeAmount").text(After.Me.CurrentCharge);
            $("#divWillpowerAmount").text(After.Me.CurrentWillpower);
            $("#svgEnergy").css("width", (After.Me.CurrentEnergy / After.Me.MaxEnergy * 100) + "%");
            $("#svgCharge").css("width", (After.Me.CurrentCharge / After.Me.MaxCharge * 100) + "%");
            $("#svgWillpower").css("width", (After.Me.CurrentWillpower / After.Me.MaxWillpower * 100) + "%");
            // TODO: Percentages to increase/decrease bars.
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