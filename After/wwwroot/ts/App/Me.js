import { PlayerCharacter } from "../Models/PlayerCharacter.js";
import { Scene } from "../Models/Scene.js";
export const Me = new class {
    constructor() {
        this.Character = new PlayerCharacter();
        this.Scene = new Scene();
    }
};
//# sourceMappingURL=Me.js.map