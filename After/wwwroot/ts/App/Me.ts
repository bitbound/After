import { PlayerCharacter } from "../Models/PlayerCharacter.js";
import { Main } from "../Main.js";
import { Scene } from "../Models/Scene.js"


export const Me = new class {
    Character: PlayerCharacter = new PlayerCharacter()
    Scene = new Scene();
}