import { GameObject } from "./GameObject.js";
import { Main } from "../Main.js";
import { PixiHelper } from "../App/PixiHelper.js";
export class Character extends GameObject {
    constructor() {
        super(...arguments);
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
                        "value": 75,
                        "time": 0
                    },
                    {
                        "value": 25,
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
                "min": 0.75,
                "max": 1.5
            },
            "blendMode": "normal",
            "frequency": 0.002,
            "emitterLifetime": -1,
            "maxParticles": 750,
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
    }
    CreateGraphics() {
        this.EmitterConfig.color.list[1].value = this.Color;
        this.ParticleContainer = new PIXI.particles.ParticleContainer();
        this.WrapperContainer = new PIXI.Container();
        this.WrapperContainer.name = this.ID;
        this.WrapperContainer.height = this.Height;
        this.WrapperContainer.width = this.Width;
        this.WrapperContainer.position = PixiHelper.GetCoordsRelativeToMe(this);
        this.WrapperContainer.addChild(this.ParticleContainer);
        //var centerCircle = new PIXI.Graphics();
        //centerCircle.beginFill(PIXI.utils.rgb2hex([1, 1, 1]), 1);
        //centerCircle.drawCircle(0, 0, this.Width / 2);
        //centerCircle.endFill();
        //this.WrapperContainer.addChild(centerCircle);
        if (this.ID == Main.Me.Character.ID) {
            Main.Renderer.PixiApp.stage.addChild(this.WrapperContainer);
        }
        else {
            Main.Renderer.SceneContainer.addChild(this.WrapperContainer);
        }
        this.Emitter = new PIXI.particles.Emitter(this.ParticleContainer, ["/Assets/Images/CharacterParticle.png"], this.EmitterConfig);
    }
    ;
}
//# sourceMappingURL=Character.js.map