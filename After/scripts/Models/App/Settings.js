var After;
(function (After) {
    var Models;
    (function (Models) {
        var App;
        (function (App) {
            class Settings {
                constructor() {
                    this.FollowPlayer = true;
                    this.dPad = true;
                    this.joystick = false;
                }
                get DPad() {
                    return this.dPad;
                }
                set DPad(value) {
                    this.dPad = value;
                    if (value) {
                        $("#divDPad").show();
                        this.Joystick = false;
                        $('#divSideTabs div[prop="Joystick"]').attr("on", "false");
                        var request = {
                            "Category": "Accounts",
                            "Type": "ChangeSetting",
                            "Property": "Joystick",
                            "Value": false
                        };
                        After.Connection.Socket.send(JSON.stringify(request));
                    }
                    else {
                        $("#divDPad").hide();
                    }
                }
                get Joystick() {
                    return this.joystick;
                }
                set Joystick(value) {
                    this.joystick = value;
                    if (value) {
                        $("#divJoystick").show();
                        this.DPad = false;
                        $('#divSideTabs div[prop="DPad"]').attr("on", "false");
                        var request = {
                            "Category": "Accounts",
                            "Type": "ChangeSetting",
                            "Property": "DPad",
                            "Value": false
                        };
                        After.Connection.Socket.send(JSON.stringify(request));
                    }
                    else {
                        $("#divJoystick").hide();
                    }
                }
            }
            App.Settings = Settings;
        })(App = Models.App || (Models.App = {}));
    })(Models = After.Models || (After.Models = {}));
})(After || (After = {}));
//# sourceMappingURL=Settings.js.map