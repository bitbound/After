namespace After.Models.Game {
    export class Area implements After.Models.Bases.Selectable {
        constructor(XCoord: number, YCoord: number, ZCoord: string) {
            this.XCoord = XCoord;
            this.YCoord = YCoord;
            this.ZCoord = ZCoord;
            this.Color = "gray";
            this.IsSelected = false;
            this.IsVisible = false;
            this.Occupants = new Array<string>();
        }
        XCoord: number;
        YCoord: number;
        ZCoord: string;
        StorageID: string;
        Color: string;
        Title: string;
        Description: string;
        InvestedWillpower: number;
        Occupants: Array<string>;

        //*** Visual Only Properties ***//
        IsSelected: boolean;
        IsVisible: boolean;
    }
}