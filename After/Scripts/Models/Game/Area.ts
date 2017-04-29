namespace After.Models.Game {
    export class Area implements After.Models.Bases.Selectable {
        constructor(XCoord: number, YCoord: number, ZCoord: string) {
            this.XCoord = XCoord;
            this.YCoord = YCoord;
            this.ZCoord = ZCoord;
            this.Color = "gray";
            this.IsSelected = false;
            this.Opacity = 1;
            this.Occupants = new Array<string>();
        }
        XCoord: number;
        YCoord: number;
        ZCoord: string;
        LocationID: string;
        Color: string;
        Title: string;
        Description: string;
        InvestedWillpower: number;
        Occupants: Array<string>;

        //*** Visual Only Properties ***//
        IsSelected: boolean;
        Opacity: number;

        //*** Utility Functions ***//
        static Create(DynamicArea: any): Area {
            var area = new After.Models.Game.Area(DynamicArea.XCoord, DynamicArea.YCoord, DynamicArea.ZCoord);
            for (var prop in DynamicArea) {
                area[prop] = DynamicArea[prop];
            }
            return area;
        }
    }
}