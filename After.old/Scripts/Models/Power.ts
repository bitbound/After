namespace After.Models {
    export class Power {
        constructor() {
            this.TargetList = new Array<Targets>();
        }
        Name: string;
        Description: string;
        Category: string;
        MinRange: number;
        MaxRange: number;
        CanCrossZCoord: boolean;
        TargetList: Array<Targets>;
    }
    enum Targets {
        Self,
        Character,
        Player,
        Location
    }
}