import { GameObject } from "./GameObject.js";
import { StatusEffect } from "./StatusEffect.js";
import { Main } from "../Main.js";
import { PixiHelper } from "../App/PixiHelper.js";

export class Character extends GameObject {

    public UpdateHealthBar(): void {
        var healthBar = this.WrapperContainer.getChildByName("Healthbar") as PIXI.Graphics;
        if (healthBar) {
            healthBar.width = this.CurrentEnergy / this.MaxEnergy * this.Width;
        }
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
    public IsDead: boolean;


    public Emitter: PIXI.particles.Emitter;
    public ParticleContainer: PIXI.particles.ParticleContainer;

    public Render() {
        this.CreateEmitter(this.DefaultEmitter);
    }
    private CreateEmitter(config: any) {
        config.color.list[1].value = this.Color
        this.ParticleContainer = new PIXI.particles.ParticleContainer();
        this.WrapperContainer = new PIXI.Container();
        this.WrapperContainer.name = this.ID;
        this.WrapperContainer.height = this.Height;
        this.WrapperContainer.width = this.Width;
        this.WrapperContainer.position = PixiHelper.GetCoordsRelativeToMe(this);
        this.WrapperContainer.addChild(this.ParticleContainer);
        if (this.ID == Main.Me.Character.ID) {
            Main.Renderer.PixiApp.stage.addChild(this.WrapperContainer);
        }
        else {
            this.CreateNameplate();
            this.CreateHealthbar();

            Main.Renderer.SceneContainer.addChild(this.WrapperContainer);
        }
        this.Emitter = new PIXI.particles.Emitter(this.ParticleContainer, ["/Assets/Images/CharacterParticle.png"], config);
    }
    private CreateNameplate(): any {
        var nameplate = new PIXI.Text(this.Name,
            {
                fill: this.Color,
                fontSize: 12
            });
        nameplate.name = "Nameplate";
        nameplate.x = -(nameplate.width / 2);
        nameplate.y = -(this.Height + 20);
        this.WrapperContainer.addChild(nameplate);
    }
    private CreateHealthbar(): void {
        var healthbar = new PIXI.Graphics();
        healthbar.name = "Healthbar";
        healthbar.width = this.Width;
        healthbar.beginFill(Main.Utilities.HexStringToNumber(this.Color));
        healthbar.drawRect(0, 0, this.Width, 4);
        healthbar.endFill();
        healthbar.x = -(this.Width / 2);
        healthbar.y = -(this.Height + 25);
        this.WrapperContainer.addChild(healthbar);
    }
;
    public RenderDead() {
        this.CreateEmitter(this.DeathEmitter);
    }
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
    }

    public DeathEmitter = {
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
                    "value": .1,
                    "time": 0
                },
                {
                    "value": .01,
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
                    "value": 50,
                    "time": 0
                },
                {
                    "value": 30,
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
            "min": 2,
            "max": 3
        },
        "blendMode": "normal",
        "frequency": 0.005,
        "emitterLifetime": -1,
        "maxParticles": 500,
        "pos": {
            "x": 0,
            "y": 0
        },
        "addAtBack": false,
        "spawnType": "circle",
        "spawnCircle": {
            "x": 0,
            "y": 0,
            "r": 10
        },
        "autoUpdate": true
    }
}