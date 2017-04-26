namespace After.Models.Game {
    export class Soul {
        constructor() {
            this.Type = "Soul";
            this.Name = "";
            this.XCoord = 0;
            this.YCoord = 0;
            this.ZCoord = "0";
            this.Color = "gray";
        };
        Type: string;
        CharacterID: number;
        Name: string;
        XCoord: number;
        YCoord: number;
        ZCoord: string;
        get CurrentXYZ() {
            return this.XCoord.toString() + "," + this.YCoord.toString() + "," + this.ZCoord;
        };
        set CurrentXYZ(XYZ: string) {
            var locArray = XYZ.split(",");
            this.XCoord = Number(locArray[0]);
            this.YCoord = Number(locArray[1]);
            this.ZCoord = locArray[2];
        }
        Color: string;
        static Create(DynamicSoul: any) : Soul {
            var soul = new After.Models.Game.Soul();
            for (var stat in DynamicSoul) {
                soul[stat] = DynamicSoul[stat];
            }
            return soul;
        }
    }
}