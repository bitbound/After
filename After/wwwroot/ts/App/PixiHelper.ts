import { Main } from "../Main.js";
import { Settings } from "./Settings.js";
import { GameObject } from "../Models/GameObject.js";
import { Character } from "../Models/Character.js";
import { Utilities } from "./Utilities.js";
import { Projectile } from "../Models/Projectile.js";

export const PixiHelper = new class {
    GetCoordsRelativeToMe(x: GameObject) {
        return new PIXI.Point(
            (x.XCoord - Main.Me.Character.XCoord) + (Main.Renderer.PixiApp.screen.width / 2) + (x.Width / 2) - (Main.Me.Character.Width / 2),
            (x.YCoord - Main.Me.Character.YCoord) + (Main.Renderer.PixiApp.screen.height / 2) + (x.Height / 2) - (Main.Me.Character.Height / 2)
        )
    }
    GetEventPoint(x: number, y: number) {
        return new PIXI.Point(
            (x - Main.Me.Character.XCoord) + (Main.Renderer.PixiApp.screen.width / 2) - (Main.Me.Character.Width / 2),
            (y - Main.Me.Character.YCoord) + (Main.Renderer.PixiApp.screen.height / 2) - (Main.Me.Character.Height / 2)
        )
    }
    UpdateGameObjectPosition(x: GameObject): any {
        var target = this.GetCoordsRelativeToMe(x);
        var fromX;
        var fromY;
        var objectToUpdate:PIXI.DisplayObject;
       
        switch (x.Discriminator) {
            case "Character":
            case "PlayerCharacter":
            case "Projectile":
                objectToUpdate = x.WrapperContainer;
                (x as Character | Projectile).ParticleContainer.children.forEach(part => {
                    part.x -= x.VelocityX * .2;
                    part.y -= x.VelocityY * .2;
                })
                break;
            default:
                break;

        }
        if (objectToUpdate.x != target.x) {
            Main.Utilities.Tween(objectToUpdate, "x", target.x, 20);
        }
        if (objectToUpdate.y != target.y) {
            Main.Utilities.Tween(objectToUpdate, "y", target.y, 20);
        }
        //objectToUpdate.x = target.x;
        //objectToUpdate.y = target.y;
       
    }

    GetDistanceBetween(point1: PIXI.Point, point2: PIXI.Point) {
        return Math.sqrt(
            Math.pow(point1.x - point2.x, 2) +
            Math.pow(point1.y - point2.y, 2)
        );
    }
    GetAngleInDegrees(centerPoint: PIXI.Point, targetPoint: PIXI.Point) {
        var dx = centerPoint.x - targetPoint.x;
        var dy = centerPoint.y - targetPoint.y;
        return Math.atan2(dy, dx) * 180 / Math.PI;
    }
    GetAngleInRadians(centerPoint: PIXI.Point, targetPoint: PIXI.Point) {
        var dx = centerPoint.x - targetPoint.x;
        var dy = centerPoint.y - targetPoint.y;
        return Math.atan2(dy, dx);
    }
    LoadBackgroundEmitter(rendererWidth:number, rendererHeight:number): any {
        backgroundEmitterConfig.spawnRect = {
            "x": -(rendererWidth / 2),
            "y": -(rendererHeight / 2),
            "w": rendererWidth * 2,
            "h": rendererHeight * 2
        };
        var container = new PIXI.particles.ParticleContainer;
        Main.Renderer.BackgroundParticleContainer = container;
        container.name = "Background Emitter";
        Main.Renderer.PixiApp.stage.addChild(container);
        Main.Renderer.BackgroundEmitter = new PIXI.particles.Emitter(container, ["/Assets/Images/particle.png"], backgroundEmitterConfig);
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
                "value": "#B3F7FF",
                "time": 0
            },
            {
                "value": "#75F0FF",
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
        "x": 0,
        "y": 0,
        "w": 0,
        "h": 0
    },
    "autoUpdate": true
};