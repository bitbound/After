var After;
(function (After) {
    var Models;
    (function (Models) {
        var App;
        (function (App) {
            class Me {
                constructor() {
                    this.Name = sessionStorage["Username"];
                    this.IsCharging = false;
                    this.IsMoving = false;
                }
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
                UpdateStatsUI() {
                    $("#divEnergyAmount").text(After.Me.CurrentEnergy);
                    $("#divChargeAmount").text(After.Me.CurrentCharge);
                    $("#divWillpowerAmount").text(After.Me.CurrentWillpower);
                    $("#svgEnergy").css("width", (After.Me.CurrentEnergy / After.Me.MaxEnergy * 100) + "%");
                    $("#svgCharge").css("width", (After.Me.CurrentCharge / After.Me.MaxCharge * 100) + "%");
                    $("#svgWillpower").css("width", (After.Me.CurrentWillpower / After.Me.MaxWillpower * 100) + "%");
                    // TODO: Percentages to increase/decrease bars.
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
            }
            App.Me = Me;
        })(App = Models.App || (Models.App = {}));
    })(Models = After.Models || (After.Models = {}));
})(After || (After = {}));
//# sourceMappingURL=Me.js.map