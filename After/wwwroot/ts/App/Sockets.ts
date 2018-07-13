import { PlayerCharacter } from "../Models/PlayerCharacter.js";
import { Main } from "../Main.js";
import { Utilities } from "./Utilities.js";
import { Input } from "./Input.js";


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
    Invoke(methodName: string, args: any) {
        this.Connection.invoke(methodName, args);
    }
}

function applyMessageHandlers(hubConnection: any) {
    hubConnection.on("PlayerUpdate", (args) => {
        Main.Me.Character = args as PlayerCharacter;
        Main.Me.EmitterConfig.color.end = Main.Me.Character.Color;
        Main.Me.CreateEmitter(Main.Renderer);
    });
}