import { GameObject } from "./GameObject.js";
export class Character extends GameObject {
    constructor() {
        super();
        this.CoreEnergy = 100;
        this.Height = 25;
        this.Width = 25;
        this.XCoord = 0;
        this.YCoord = 0;
        this.ZCoord = "0";
    }
    OnCollision(collidingObject) {
    }
}
//# sourceMappingURL=Character.js.map