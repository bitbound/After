var After;
(function (After) {
    var Models;
    (function (Models) {
        var App;
        (function (App) {
            class Settings {
                constructor() {
                    this.FollowPlayer = true;
                }
                get DPad() {
                    return Boolean($('#divSideTabs div[prop="DPad"]').attr("on"));
                }
                set DPad(value) {
                    $('#divSideTabs div[prop="DPad"]').attr("on", String(value));
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
                    return Boolean($('#divSideTabs div[prop="Joystick"]').attr("on"));
                }
                set Joystick(value) {
                    $('#divSideTabs div[prop="Joystick"]').attr("on", String(value));
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
