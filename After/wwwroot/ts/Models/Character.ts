import { GameObject } from "./GameObject.js";
import { StatusEffect } from "./StatusEffect.js";
import { Main } from "../Main.js";
import { PixiHelper } from "../App/PixiHelper.js";

export class Character extends GameObject {
    constructor() {
        super();
        this.CoreEnergy = 100;
        this.Height = 25;
        this.Width = 25;
        this.XCoord = 0;
        this.YCoord = 0;
        this.ZCoord = "0";
    }
    public Name: string;
    public PortraitUri: string;

    // Energy.
    public CoreEnergy: number;
    public CoreEnergyPeak: number;
    public MaxEnergy: number;
    public CurrentEnergy: number;

    // Charge.
    public MaxCharge: number;
    public CurrentCharge: number;

    // Willpower.
    public MaxWillpower: number;
    public CurrentWillpower: number;

    public MaxVelocity: number;

    public StatusEffects: Array<StatusEffect>;


    public Emitter: PIXI.particles.Emitter;
    public ParticleContainer: PIXI.particles.ParticleContainer;

    public CreateGraphics() {
        this.EmitterConfig.color.list[1].value = this.Color
        this.WrapperContainer = new PIXI.Container();
        this.ParticleContainer = new PIXI.particles.ParticleContainer();
        this.WrapperContainer.x = (this.XCoord - Main.Me.Character.XCoord) + (Main.Renderer.PixiApp.screen.width / 2);
        this.WrapperContainer.y = (this.YCoord - Main.Me.Character.YCoord) + (Main.Renderer.PixiApp.screen.height / 2);
        this.WrapperContainer.name = this.ID;
        this.WrapperContainer.addChild(this.ParticleContainer);
        if (this.ID == Main.Me.Character.ID) {

            Main.Renderer.PixiApp.stage.addChild(this.WrapperContainer);
            this.Emitter = new PIXI.particles.Emitter(this.ParticleContainer, ["/Assets/Images/CharacterParticle.png"], this.EmitterConfig);
  
        }
        else {
            Main.Renderer.SceneContainer.addChild(this.WrapperContainer);
            this.Emitter = new PIXI.particles.Emitter(this.ParticleContainer, ["/Assets/Images/CharacterParticle.png"], this.EmitterConfig);
        }

    };
    public EmitterConfig = {
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
            "min": 0.5,
            "max": 1.0
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
    }
}