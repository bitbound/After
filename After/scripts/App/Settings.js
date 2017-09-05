var After;
(function (After) {
    var App;
    (function (App) {
        class Settings {
            get FollowPlayer() {
                return ($('#divSettingsFrame .switch-outer[prop="FollowPlayer"]').attr("on") == "true");
            }
            set FollowPlayer(value) {
                $('#divSettingsFrame .switch-outer[prop="FollowPlayer"]').attr("on", String(value));
            }
            get DPad() {
                return ($('#divSettingsFrame .switch-outer[prop="DPad"]').attr("on") == "true");
            }
            set DPad(value) {
                $('#divSettingsFrame .switch-outer[prop="DPad"]').attr("on", String(value));
                if (value) {
                    $("#divDPad").show();
                    this.Joystick = false;
                    $('#divSettingsFrame .switch-outer[prop="Joystick"]').attr("on", "false");
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
                return ($('#divSettingsFrame .switch-outer[prop="Joystick"]').attr("on") == "true");
            }
            set Joystick(value) {
                $('#divSettingsFrame .switch-outer[prop="Joystick"]').attr("on", String(value));
                if (value) {
                    $("#divJoystick").show();
                    this.DPad = false;
                    $('#divSettingsFrame .switch-outer[prop="DPad"]').attr("on", "false");
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
            get LockTabs() {
                return ($('#divSettingsFrame .switch-outer[prop="LockTabs"]').attr("on") == "true");
            }
            set LockTabs(value) {
                $('#divSettingsFrame .switch-outer[prop="LockTabs"]').attr("on", String(value));
            }
        }
        App.Settings = Settings;
    })(App = After.App || (After.App = {}));
})(After || (After = {}));
