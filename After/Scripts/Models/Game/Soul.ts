namespace After.Models.Game {
    export class Soul {
        constructor() {
            this.Type = "Soul";
            this.Name = "";
            this.XCoord = 0;
            this.YCoord = 0;
            this.ZCoord = "0";
            this.CurrentX = 0;
            this.CurrentY = 0;
            this.Color = "";
            this.Owner = "";
            this.Particles = new Array<Particle>();
            this.Interval = window.setInterval(function () {

            }, 25);
        };
        Type: string;
        CharacterID: number;
        Name: string;
        XCoord: number;
        YCoord: number;
        ZCoord: string;
        CurrentX: number;
        CurrentY: number;
        ParentBounds: {
            top: number,
            right: number,
            bottom: number,
            left: number
        };
        Particles: Array<Particle>;
        Interval: number;
        Color: string;
        Owner: string;
    }
}