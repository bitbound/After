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
    public Name: string;
    public Color: string;
    public PortraitUri: string;

    // Energy.
    public CoreEnergy: number;
    public CoreEnergyPeak: number;
    public MaxEnergyModifier: number;
    public MaxEnergy: number;
    public CurrentEnergy: number;

    // Charge.
    public CurrentCharge: number;

    // Willpower.
    public MaxWillpowerModifier: number;
    public MaxWillpower: number;
    public CurrentWillpower: number;

    public OnCollision(collidingObject: GameObject): void {
        
    }
}