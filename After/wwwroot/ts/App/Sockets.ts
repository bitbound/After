import { PlayerCharacter } from "../Models/PlayerCharacter.js";
import { Main } from "../Main.js";
import { Utilities } from "./Utilities.js";
import { Input } from "./Input.js";
import { UI } from "./UI.js";


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
                Main.Settings.IsDebugEnabled = true;
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
    hubConnection.on("PlayerUpdate", (args : PlayerCharacter) => {
        if (Main.Me.Character == null) {
            UI.AddSystemMessage("Welcome to After.");
            Main.Me.Character = args;
            Main.Me.EmitterConfig.color.end = Main.Me.Character.Color;
            Main.Me.CreateEmitter(Main.Renderer);
        }
        else {
            $.extend(true, Main.Me.Character, args);
        }
        UI.UpdatePlayerStats();
    });

    hubConnection.on("ChatMessage", data => {
        switch (data.Channel) {
            case "Global":
                Main.UI.AddGlobalChat(data.CharacterName, data.Message, data.Color);
            default:
        }
    });
}