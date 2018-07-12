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
    public CoreEnergyPeak: number;
    private coreEnergy: number;
    public get CoreEnergy(): number {
        return this.coreEnergy;
    }
    public set CoreEnergy(value: number) {
        this.coreEnergy = value;
        if (value > this.CoreEnergyPeak) {
            this.CoreEnergyPeak = value;
        }
    }
    public MaxEnergyModifier: number;
    public get MaxEnergy(): number {
        return this.CoreEnergy + this.MaxEnergyModifier;
    }
    public CurrentEnergy: number;
    public CurrentCharge: number;
    public MaxWillpowerModifier: number;
    public get MaxWillpower(): number {
        return this.CoreEnergy + this.MaxWillpowerModifier;
    }
    public CurrentWillpower: number;
    public get WillpowerPercent(): number {
        return this.CurrentWillpower / this.MaxWillpower;
    }
    public OnCollision(collidingObject: GameObject): void {
        
    }
}