import After from "../Main.js";
import { Utilities } from "./Utilities.js";
export const Sockets = new class {
    Connect() {
        var signalR = window["signalR"];
        this.Connection = new signalR.HubConnectionBuilder()
            .withUrl("/SocketEndpoint")
            .configureLogging(signalR.LogLevel.Information)
            .build();
        applyMessageHandlers(this.Connection);
        this.Connection.start().then(() => {
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
        After.Me.Character = args;
        After.Me.EmitterConfig.color.end = After.Me.Character.Color;
        After.Me.CreateEmitter(After.Renderer);
    });
}
//# sourceMappingURL=Sockets.js.map