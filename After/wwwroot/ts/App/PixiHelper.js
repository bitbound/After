import { Main } from "../Main.js";
import { Settings } from "./Settings.js";
import { Utilities } from "./Utilities.js";
export const PixiHelper = new class {
    UpdateGameObjectPosition(x) {
        var targetX = (x.XCoord - Main.Me.Character.XCoord) + (Main.Renderer.PixiApp.screen.width / 2);
        var targetY = (x.YCoord - Main.Me.Character.YCoord) + (Main.Renderer.PixiApp.screen.height / 2);
        var fromX;
        var fromY;
        var objectToUpdate;
        switch (x.Discriminator) {
            case "Character":
            case "PlayerCharacter":
                objectToUpdate = x.ParticleContainer;
                x.ParticleContainer.children.forEach(part => {
                    part.x -= x.VelocityX * .5;
                    part.y -= x.VelocityY * .5;
                });
                break;
            case "Projectile":
                objectToUpdate = x.WrapperContainer;
                x.ParticleContainer.children.forEach(part => {
                    part.x -= x.VelocityX * .2;
                    part.y -= x.VelocityY * .2;
                });
                break;
            default:
                break;
        }
        fromX = objectToUpdate.x;
        fromY = objectToUpdate.y;
        if (targetX != fromX) {
            Utilities.Animate(objectToUpdate, "x", null, targetX, null, 20, 1);
        }
        if (targetY != fromY) {
            Utilities.Animate(objectToUpdate, "y", null, targetY, null, 20, 1);
        }
    }
    GetDistanceBetween(point1, point2) {
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) +
            Math.pow(point1.y - point2.y, 2));
    }
    GetAngleInDegrees(centerPoint, targetPoint) {
        var dx = centerPoint.x - targetPoint.x;
        var dy = centerPoint.y - targetPoint.y;
        return Math.atan2(dy, dx) * 180 / Math.PI;
    }
    GetAngleInRadians(centerPoint, targetPoint) {
        var dx = centerPoint.x - targetPoint.x;
        var dy = centerPoint.y - targetPoint.y;
        return Math.atan2(dy, dx);
    }
    LoadBackgroundEmitter() {
        var container = new PIXI.particles.ParticleContainer;
        Main.Renderer.BackgroundParticleContainer = container;
        container.name = "Background Emitter";
        Main.Renderer.PixiApp.stage.addChild(container);
        Main.Renderer.BackgroundEmitter = new PIXI.particles.Emitter(container, ["/Assets/Images/particle.png"], backgroundEmitterConfig);
    }
};
var backgroundEmitterConfig = {
    "alpha": {
        "list": [
            {
                "value": 0,
                "time": 0
            },
            {
                "value": 0.25,
                "time": 0.1
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
//# sourceMappingURL=PixiHelper.js.map