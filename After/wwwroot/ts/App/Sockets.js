import { Main } from "../Main.js";
import { Utilities } from "./Utilities.js";
import { Input } from "./Input.js";
import { UI } from "./UI.js";
export const Sockets = new class {
    constructor() {
        this.IsDisconnectExpected = false;
    }
    Connect() {
        var signalR = window["signalR"];
        this.Connection = new signalR.HubConnectionBuilder()
            .withUrl("/SocketEndpoint")
            .configureLogging(signalR.LogLevel.Information)
            .build();
        applyMessageHandlers(this.Connection);
        this.Connection.start().then(() => {
            Main.StartGameLoop();
            Input.ApplyInputHandlers();
            this.Connection.invoke("Init", Utilities.QueryStrings["character"]);
        }).catch(err => {
            console.error(err.toString());
            if (!this.IsDisconnectExpected) {
                Main.UI.ShowModal("Connection Failure", "Your connection was lost.", "", () => { location.assign("/"); });
            }
            else {
                location.assign("/");
            }
        });
        this.Connection.closedCallbacks.push((ev) => {
            if (!this.IsDisconnectExpected) {
                Main.UI.ShowModal("Connection Failure", "Your connection was lost.", "", () => { location.assign("/"); });
            }
            else {
                location.assign("/");
            }
        });
    }
    Invoke(methodName, args) {
        this.Connection.invoke(methodName, args);
    }
};
function applyMessageHandlers(hubConnection) {
    hubConnection.on("UpdatePlayer", (args) => {
        if (Main.Me.Character == null) {
            UI.AddSystemMessage("Welcome to After.");
            Main.Me.Character = args;
            Main.Me.EmitterConfig.color.list[1].value = Main.Me.Character.Color;
            Main.Me.CreateEmitter(Main.Renderer);
            UI.ApplyDataBinds();
        }
        else {
            $.extend(true, Main.Me.Character, args);
        }
        UI.UpdateStatBars();
    });
    hubConnection.on("ReceiveChat", data => {
        switch (data.Channel) {
            case "Global":
                Main.UI.AddGlobalChat(data.CharacterName, data.Message, data.Color);
            default:
        }
    });
    hubConnection.on("DisconnectDuplicateConnection", args => {
        Main.Sockets.IsDisconnectExpected = true;
        Main.UI.ShowModal("Connection Closed", "Your account was logged into on another device.  This session has been closed.", "", () => { location.assign("/"); });
        hubConnection.stop();
    });
    hubConnection.on("FailLoginDueToExistingConnection", args => {
        Main.UI.ShowModal("Unable to Connection", "There is an existing connection on your account that is preventing your login.  The system was unable to disconnect it.  Please try again.");
    });
}
//# sourceMappingURL=Sockets.js.map