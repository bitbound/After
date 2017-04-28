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
                    return After.World_Data.Areas.find((value) => { return value.LocationID == After.Me.CurrentXYZ; });
                }
            }
            App.Me = Me;
        })(App = Models.App || (Models.App = {}));
    })(Models = After.Models || (After.Models = {}));
})(After || (After = {}));
//# sourceMappingURL=Me.js.map