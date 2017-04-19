namespace After.Models.Game {
    export class Soul {
        constructor() {
            this.Type = "Soul";
            this.Name = "";
            this.XCoord = 0;
            this.YCoord = 0;
            this.ZCoord = "0";
            this.Height = 1;
            this.Color = "gray";
            this.Particles = new Array<Particle>();
        };
        Type: string;
        CharacterID: number;
        Name: string;
        XCoord: number;
        YCoord: number;
        ZCoord: string;
        CurrentXYZ: string;
        Height: number;
        CrowdScale: number;
        ParentBounds: {
            top: number,
            right: number,
            bottom: number,
            left: number
        };
        Particles: Array<Particle>;
        ParticleInterval: number;
        ParticleBounds: {
            top: number,
            right: number,
            bottom: number,
            left: number
        };
        ParticleWanderTo: {
            x: number,
            y: number
        }
        Color: string;
    }
}