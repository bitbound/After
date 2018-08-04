import { Main } from "../Main.js";
import { Settings } from "./Settings.js";

export const PixiHelper = new class {
    BackgroundEmitter: any;
    GetDistanceBetween(point1: PIXI.Point, point2: PIXI.Point) {
        return Math.sqrt(
            Math.pow(point1.x - point2.x, 2) +
            Math.pow(point1.y - point2.y, 2)
        );
    }
    GetAngle(centerPoint: PIXI.Point, targetPoint: PIXI.Point) {
        var dx = centerPoint.x - targetPoint.x;
        var dy = centerPoint.y - targetPoint.y;
        return Math.atan2(dy, dx) * 180 / Math.PI;
    }
    LoadBackgroundEmitter(): any {
        var backgroundContainer = new PIXI.particles.ParticleContainer();
        backgroundContainer.name = "Background Emitter";
        Main.Renderer.PixiApp.stage.addChild(backgroundContainer);
        this.BackgroundEmitter = new PIXI.particles.Emitter(backgroundContainer, ["/Assets/Images/particle.png"], backgroundEmitterConfig);
    }
}

var backgroundEmitterConfig = {
    "alpha": {
        "list": [
            {
                "value": 0,
                "time": 0
            },
            {
                "value": 0.25,
                "time": 0.5
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
                "value": 0.1,
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
                "value": "#FCFFA9",
                "time": 0
            },
            {
                "value": "#FFF261",
                "time": 1
            }
        ],
        "isStepped": false
    },
    "speed": {
        "list": [
            {
                "value": 10,
                "time": 0
            },
            {
                "value": 5,
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
        "min": 5,
        "max": 10
    },
    "blendMode": "normal",
    "frequency": 0.01,
    "emitterLifetime": -1,
    "maxParticles": 1000,
    "pos": {
        "x": 0,
        "y": 0
    },
    "addAtBack": true,
    "spawnType": "rect",
    "spawnRect": {
        "x": -(Settings.RendererResolution.Width / 2),
        "y": -(Settings.RendererResolution.Height / 2),
        "w": Settings.RendererResolution.Width * 2,
        "h": Settings.RendererResolution.Height * 2
    },
    "autoUpdate": true
};