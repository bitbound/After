import { PlayerCharacter } from "../Models/PlayerCharacter.js";
import { Main } from "../Main.js";
import { Utilities } from "./Utilities.js";
import { Input } from "./Input.js";
import { UI } from "./UI.js";
import { GameObject } from "../Models/GameObject.js";
import { Me } from "./Me.js";
import { Settings } from "./Settings.js";
import { PixiHelper } from "./PixiHelper.js";
import { Character } from "../Models/Character.js";
import { Projectile } from "../Models/Projectile.js";
import { GameEvent } from "../Models/GameEvent.js";

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
    IsDisconnectExpected: boolean = false;
    Invoke(methodName: string, ...rest) {
        this.Connection.invoke(methodName, ...rest);
    }
}

function applyMessageHandlers(hubConnection: any) {
    hubConnection.on("InitialUpdate", (currentCharacter: Character, renderWidth: number, renderHeight: number) => {
        Main.Init(currentCharacter, renderWidth, renderHeight);
      
    });

    hubConnection.on("ReceiveChat", (channel:string, characterName:string, message:string, color:string)  => {
        switch (channel) {
            case "Global":
                Main.UI.AddGlobalChat(characterName, message, color);
            default:
        }
    });

    hubConnection.on("DisconnectDuplicateConnection", () => {
        Main.Sockets.IsDisconnectExpected = true;
        Main.UI.ShowModal("Connection Closed", "Your account was logged into on another device.  This session has been closed.", "", () => { location.assign("/"); });
        hubConnection.stop();
    })
    hubConnection.on("FailLoginDueToExistingConnection", () => {
        Main.UI.ShowModal("Unable to Connection", "There is an existing connection on your account that is preventing your login.  The system was unable to disconnect it.  Please try again.");
    })

    hubConnection.on("UpdateGameState", (args: Array<GameObject>) => {
        args.forEach(x => {
            if (x.ID == Me.Character.ID) {
                $.extend(true, Me.Character, x);
                UI.UpdateStatBars();
            }
            else {
                var index = Main.Me.Scene.GameObjects.findIndex(y => y.ID == x.ID);
                if (index > -1) {
                    $.extend(true, Main.Me.Scene.GameObjects[index], x);
                }
                else {
                    var newObject;
                    switch (x.Discriminator) {
                        case "Character":
                            newObject = new Character();
                            break;
                        case "PlayerCharacter":
                            newObject = new PlayerCharacter();
                            break;
                        case "Projectile":
                            newObject = new Projectile();
                            break;
                        default:
                            newObject = new GameObject();
                            break;
                    }
                    $.extend(true, newObject, x);
                    Main.Me.Scene.GameObjects.push(newObject);
                }
            }
        });
        Main.Me.Scene.GameObjects.forEach(go => {
            if (!args.some(arg => arg.ID == go.ID)) {
                var index = Main.Me.Scene.GameObjects.indexOf(go);
                Main.Me.Scene.GameObjects.splice(index, 1);
                if (go["Emitter"]) {
                    (go as Character).Emitter.destroy();
                }
            }
        });
    })
    hubConnection.on("ShowGameEvents", (args: Array<GameEvent>) => {
        args.forEach(value => {
            Main.GameEvents.ProcessEvent(value);
        })
    });
    hubConnection.on("CharacterConnected", characterName => {
        UI.AddSystemMessage(characterName + " has joined.");
    });
    hubConnection.on("CharacterDisconnected", characterName => {
        UI.AddSystemMessage(characterName + " has left.");
    });
    hubConnection.on("Ping", (time: number) => {
        UI.PingSpan.innerText = String(Date.now() - time) + "ms";
        if (Main.Settings.Local.IsDebugEnabled) {
            window.setTimeout(() => {
                Sockets.Invoke("Ping", Date.now());
            }, 1000);
        }
    })
}