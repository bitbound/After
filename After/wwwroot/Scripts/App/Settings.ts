namespace After.App {
    export class Settings {

        public get FollowPlayer() {
            return ($('#divSettingsFrame .switch-outer[prop="FollowPlayer"]').attr("on") == "true");
        }
        public set FollowPlayer(value: boolean) {
            $('#divSettingsFrame .switch-outer[prop="FollowPlayer"]').attr("on", String(value));
        }
        public get DPad() {
            return ($('#divSettingsFrame .switch-outer[prop="DPad"]').attr("on") == "true");
        }
        public set DPad(value:boolean) {
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
                }
                After.Connection.Socket.send(JSON.stringify(request));
            }
            else
            {
                $("#divDPad").hide();
            }
        }
        public get Joystick() {
            return ($('#divSettingsFrame .switch-outer[prop="Joystick"]').attr("on") == "true");
        }
        public set Joystick(value:boolean) {
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
                }
                After.Connection.Socket.send(JSON.stringify(request));
            }
            else
            {
                $("#divJoystick").hide();
            }
        }
        public get LockTabs() {
            return ($('#divSettingsFrame .switch-outer[prop="LockTabs"]').attr("on") == "true");
        }
        public set LockTabs(value: boolean) {
            $('#divSettingsFrame .switch-outer[prop="LockTabs"]').attr("on", String(value));
        }
    }
}