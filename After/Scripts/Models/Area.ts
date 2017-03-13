namespace After.Models {
    export class Area implements After.Models.Bases.Selectable {
        constructor(XCoord: number, YCoord: number, ZCoord: string) {
            this.Type = "Area";
            this.XCoord = XCoord;
            this.YCoord = YCoord;
            this.ZCoord = ZCoord;
            this.Color = "gray";
            this.IsSelected = false;
        }
        Type: string;
        XCoord: number;
        YCoord: number;
        ZCoord: string;
        Color: string;
        IsSelected: boolean;
    }
}