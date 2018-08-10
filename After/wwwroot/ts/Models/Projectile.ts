import { GameObject } from "./GameObject.js";
import { Main } from "../Main.js";
import { Character } from "./Character.js";
import { PixiHelper } from "../App/PixiHelper.js";

export class Projectile extends GameObject {
    public Owner: string;
    public Magnitude: number;
    public Force: number;
    public Emitter: PIXI.particles.Emitter;
    public ParticleContainer: PIXI.particles.ParticleContainer;
    public CreateGraphics() {
        var size = this.Width + (this.Width * this.Magnitude);
        this.ParticleContainer = new PIXI.particles.ParticleContainer();
        this.WrapperContainer = new PIXI.Container();
        this.WrapperContainer.name = this.ID;
        this.WrapperContainer.height = size;
        this.WrapperContainer.width = size;
        this.WrapperContainer.position = PixiHelper.GetCoordsRelativeToMe(this);

        var centerCircle = new PIXI.Graphics();
        centerCircle.beginFill(PIXI.utils.rgb2hex([1, 1, 1]), 1);
        centerCircle.drawCircle(0, 0, size / 2);
        centerCircle.endFill();
        this.WrapperContainer.addChild(centerCircle);

        this.DefaultEmitter.color.list[1].value = this.Color;
        this.DefaultEmitter.scale.list[0].value += this.DefaultEmitter.scale.list[0].value * this.Magnitude;
        this.DefaultEmitter.scale.list[1].value += this.DefaultEmitter.scale.list[1].value * this.Magnitude;
        this.WrapperContainer.addChild(this.ParticleContainer);
        Main.Renderer.SceneContainer.addChild(this.WrapperContainer);

        this.Emitter = new PIXI.particles.Emitter(this.ParticleContainer, ["/Assets/Images/ProjectileParticle.png"], this.DefaultEmitter);

    };
    public DefaultEmitter = {
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
                    "value": "#FFFFFF",
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
    }
}