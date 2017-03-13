namespace After {
    export const Debug = false;
    export const Temp = <any> {};
    export const Me = {
        Name: sessionStorage["Username"],
        Color: "",
        IsCharging: false,
        IsMoving: false,
        CoreEnergy: 0,
        CoreEnergyPeak: 0,
        CurrentEnergy: 0,
        MaxEnergy: 0,
        MaxEnergyModifier: 0,
        CurrentCharge: 0,
        MaxCharge: 0,
        MaxChargeModifier: 0,
        CurrentWillpower: 0,
        MaxWillpower: 0,
        MaxWillpowerModifier: 0,
        ViewDistance: 2,
        CurrentLocation: {},

        StartCharging: function () {
            var request = {
                Type: "Event",
                EventType: "StartCharging",
                Username: After.Me.Name,
            };
            After.Connection.Socket.send(JSON.stringify(request));
        },
        ToggleCharging: function () {
            var request = <any>{
                Type: "Event",
                Username: After.Me.Name,
            };
            if (After.Me.IsCharging) {
                request.EventType = "StopCharging";
            }
            else {
                request.EventType = "StartCharging";
            }
            After.Connection.Socket.send(JSON.stringify(request));
        },
        UpdateStatsUI: function () {
            $("#divEnergyAmount").text(After.Me.CurrentEnergy);
            $("#divChargeAmount").text(After.Me.CurrentCharge);
            $("#divWillpowerAmount").text(After.Me.CurrentWillpower);
            $("#svgEnergy").css("width", (After.Me.CurrentEnergy / After.Me.MaxEnergy * 100) + "%");
            $("#svgCharge").css("width", (After.Me.CurrentCharge / After.Me.MaxCharge * 100) + "%");
            $("#svgWillpower").css("width", (After.Me.CurrentWillpower / After.Me.MaxWillpower * 100) + "%");
            // TODO: Percentages to increase/decrease bars.
        },
        Move: function (strDirection:string) {
            var request = {
                "Type": "Event",
                "EventType": "PlayerMove",
                "Direction": strDirection.toUpperCase()
            };
            After.Connection.Socket.send(JSON.stringify(request));
        }
    }
    //export const Test = {
    //    TestProperty: <String>"Hi",
    //}
}
namespace After.World_Data {
    export const Areas = new Array<After.Models.Area>();
    export const Souls = new Array<After.Models.Soul>();
}