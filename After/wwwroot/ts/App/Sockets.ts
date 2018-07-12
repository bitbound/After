import { PlayerCharacter } from "../Models/PlayerCharacter.js";
import After from "../Main.js";
import { Utilities } from "./Utilities.js";


export const Sockets = new class {
    Connection: any;
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
    Invoke(methodName: string, args: any) {
        this.Connection.invoke(methodName, args);
    }
}

function applyMessageHandlers(hubConnection: any) {
    hubConnection.on("PlayerUpdate", (args) => {
        After.Me.Character = args as PlayerCharacter;
        After.Me.EmitterConfig.color.end = After.Me.Character.Color;
        After.Me.CreateEmitter(After.Renderer);
    });
}