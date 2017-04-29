namespace After.Models.App {
    export class Settings {
        FollowPlayer: boolean = true;

        private dPad: boolean = true;
        public get DPad() {
            return this.dPad;
        }
        public set DPad(value) {
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
                }
                After.Connection.Socket.send(JSON.stringify(request));
            }
            else
            {
                $("#divDPad").hide();
            }
        }
        private joystick: boolean = false;
        public get Joystick() {
            return this.joystick;
        }
        public set Joystick(value) {
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
                }
                After.Connection.Socket.send(JSON.stringify(request));
            }
            else
            {
                $("#divJoystick").hide();
            }
        }
    }
}