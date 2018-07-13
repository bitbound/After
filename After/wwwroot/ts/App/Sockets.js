import { Main } from "../Main.js";
import { Utilities } from "./Utilities.js";
import { Input } from "./Input.js";
export const Sockets = new class {
    Connect() {
        var signalR = window["signalR"];
        this.Connection = new signalR.HubConnectionBuilder()
            .withUrl("/SocketEndpoint")
            .configureLogging(signalR.LogLevel.Information)
            .build();
        applyMessageHandlers(this.Connection);
        this.Connection.start().then(() => {
            if (location.href.indexOf("localhost") > -1) {
                Main.Settings.ShowDebug = true;
            }
            Main.StartGameLoop();
            Input.ApplyInputHandlers();
            this.Connection.invoke("Init", Utilities.QueryStrings["character"]);
        }).catch(err => {
            console.error(err.toString());
        });
    }
    Invoke(methodName, args) {
        this.Connection.invoke(methodName, args);
    }
};
function applyMessageHandlers(hubConnection) {
    hubConnection.on("PlayerUpdate", (args) => {
        Main.Me.Character = args;
        Main.Me.EmitterConfig.color.end = Main.Me.Character.Color;
        Main.Me.CreateEmitter(Main.Renderer);
    });
}
//# sourceMappingURL=Sockets.js.map