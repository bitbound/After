import { GameObject } from "./GameObject.js";
import { Main } from "../Main.js";
export class Projectile extends GameObject {
    constructor() {
        super();
        this.EmitterConfig = {
            "alpha": {
                "list": [
                    {
                        "value": 1,
                        "time": 0
                    },
                    {
                        "value": 0,
                        "time": 1
                    }
                ],
                "isStepped": false
            },
            "scale": {
                "list": [
                    {
                        "value": 1,
                        "time": 0
                    },
                    {
                        "value": .9,
                        "time": 1
                    }
                ],
                "isStepped": false,
                "minimumScaleMultiplier": 0.1
            },
            "color": {
                "list": [
                    {
                        "value": "#ffffff",
                        "time": 0
                    },
                    {
                        "value": "#808080",
                        "time": 1
                    }
                ],
                "isStepped": false
            },
            "speed": {
                "list": [
                    {
                        "value": 40,
                        "time": 0
                    },
                    {
                        "value": 20,
                        "time": 1
                    }
                ],
                "isStepped": false,
                "minimumSpeedMultiplier": 0.1
            },
            "acceleration": {
                "x": 0,
                "y": 0
            },
            "maxSpeed": 0,
            "startRotation": {
                "min": 0,
                "max": 360
            },
            "noRotation": false,
            "rotationSpeed": {
                "min": 0,
                "max": 0
            },
            "lifetime": {
                "min": 0.25,
                "max": 0.5
            },
            "blendMode": "normal",
            "frequency": 0.001,
            "emitterLifetime": -1,
            "maxParticles": 100,
            "pos": {
                "x": 0,
                "y": 0
            },
            "addAtBack": false,
            "spawnType": "circle",
            "spawnCircle": {
                "x": 0,
                "y": 0,
                "r": 0
            },
            "autoUpdate": true
        };
        this.Height = 5;
        this.Width = 5;
    }
    CreateGraphics() {
        this.WrapperContainer = new PIXI.Container();
        this.ParticleContainer = new PIXI.particles.ParticleContainer();
        this.WrapperContainer.x = (this.XCoord - Main.Me.Character.XCoord) + (Main.Renderer.PixiApp.screen.width / 2);
        this.WrapperContainer.y = (this.YCoord - Main.Me.Character.YCoord) + (Main.Renderer.PixiApp.screen.height / 2);
        this.WrapperContainer.name = this.ID;
        var centerCircle = new PIXI.Graphics();
        centerCircle.beginFill(PIXI.utils.rgb2hex([1, 1, 1]), 1);
        centerCircle.drawCircle(0, 0, 5 + (5 * this.Magnitude));
        centerCircle.endFill();
        this.WrapperContainer.addChild(centerCircle);
        this.EmitterConfig.color.list[1].value = this.Color;
        this.EmitterConfig.scale.list[0].value += this.EmitterConfig.scale.list[0].value * this.Magnitude;
        this.EmitterConfig.scale.list[1].value += this.EmitterConfig.scale.list[1].value * this.Magnitude;
        this.WrapperContainer.addChild(this.ParticleContainer);
        Main.Renderer.SceneContainer.addChild(this.WrapperContainer);
        this.Emitter = new PIXI.particles.Emitter(this.ParticleContainer, ["/Assets/Images/ProjectileParticle.png"], this.EmitterConfig);
    }
    ;
}
//# sourceMappingURL=Projectile.js.map