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
    get CoreEnergy() {
        return this.coreEnergy;
    }
    set CoreEnergy(value) {
        this.coreEnergy = value;
        if (value > this.CoreEnergyPeak) {
            this.CoreEnergyPeak = value;
        }
    }
    get MaxEnergy() {
        return this.CoreEnergy + this.MaxEnergyModifier;
    }
    get MaxWillpower() {
        return this.CoreEnergy + this.MaxWillpowerModifier;
    }
    get WillpowerPercent() {
        return this.CurrentWillpower / this.MaxWillpower;
    }
    OnCollision(collidingObject) {
    }
}
//# sourceMappingURL=Character.js.map