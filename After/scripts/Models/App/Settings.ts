namespace After.Models.App {
    export class Settings {
        FollowPlayer: boolean = true;
        public get DPad() {
            return Boolean($('#divSideTabs div[prop="DPad"]').attr("on"));
        }
        public set DPad(value:boolean) {
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
                }
                After.Connection.Socket.send(JSON.stringify(request));
            }
            else
            {
                $("#divDPad").hide();
            }
        }
        public get Joystick() {
            return Boolean($('#divSideTabs div[prop="Joystick"]').attr("on"));
        }
        public set Joystick(value:boolean) {
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