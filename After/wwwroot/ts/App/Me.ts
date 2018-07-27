import { PlayerCharacter } from "../Models/PlayerCharacter.js";
import { Main } from "../Main.js";

export const Me = new class {
    Character: PlayerCharacter;
    Emitter: PIXI.particles.Emitter;
    ParticleContainer: PIXI.particles.ParticleContainer;
    EmitterConfig = {
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
                    "value": 0.6,
                    "time": 0
                },
                {
                    "value": 0.5,
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
            "minimumSpeedMultiplier": 0.5
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
    CreateEmitter(mainApp: PIXI.Application) {
        this.ParticleContainer = new PIXI.particles.ParticleContainer();
        this.ParticleContainer.name = "My Particle Container";
        Main.Renderer.stage.addChild(this.ParticleContainer);
        this.Emitter = new PIXI.particles.Emitter(this.ParticleContainer, ["/Assets/Images/particle.png"], this.EmitterConfig);
        this.ParticleContainer.x = mainApp.screen.width / 2;
        this.ParticleContainer.y = mainApp.screen.height / 2;
    }
}