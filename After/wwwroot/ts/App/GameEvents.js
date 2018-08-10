import { Main } from "../Main.js";
import { PixiHelper } from "./PixiHelper.js";
export const GameEvents = new class {
    ProcessEvent(gameEvent) {
        switch (gameEvent.EventName) {
            case "SoulDestroyed":
                this.ShowCharacterExplosion(gameEvent.XCoord, gameEvent.YCoord, gameEvent.EventData["Color"]);
                break;
            case "ProjectileDestroyed":
                this.ShowProjectileExplosion(gameEvent.XCoord, gameEvent.YCoord, gameEvent.EventData["Color"], gameEvent.EventData["Angle"]);
                break;
            default:
        }
    }
    ShowCharacterExplosion(xcoord, ycoord, color) {
        characterExplosionConfig.color.end = color;
        characterExplosionConfig.pos = PixiHelper.GetEventPoint(xcoord, ycoord);
        var emitter = new PIXI.particles.Emitter(Main.Renderer.PixiApp.stage, ["/Assets/Images/particle.png"], characterExplosionConfig);
        emitter.playOnceAndDestroy();
    }
    ShowProjectileExplosion(xcoord, ycoord, color, angle) {
        projectileSplashConfig.color.end = color;
        projectileSplashConfig.pos = PixiHelper.GetEventPoint(xcoord, ycoord);
        projectileSplashConfig.startRotation = {
            max: angle + 15,
            min: angle - 15
        };
        var emitter = new PIXI.particles.Emitter(Main.Renderer.PixiApp.stage, ["/Assets/Images/Sparks.png"], projectileSplashConfig);
        emitter.playOnceAndDestroy();
    }
};
var characterExplosionConfig = {
    "alpha": {
        "start": 0.8,
        "end": 0.1
    },
    "scale": {
        "start": 1,
        "end": 0.3,
        "minimumScaleMultiplier": 1
    },
    "color": {
        "start": "#ffffff",
        "end": "#ffffff"
    },
    "speed": {
        "start": 200,
        "end": 100,
        "minimumSpeedMultiplier": 1
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
        "max": 0.5
    },
    "blendMode": "normal",
    "frequency": 0.001,
    "emitterLifetime": 0.1,
    "maxParticles": 1000,
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
    }
};
var projectileSplashConfig = {
    "alpha": {
        "start": 0.8,
        "end": 0.1
    },
    "scale": {
        "start": 1,
        "end": 0.3,
        "minimumScaleMultiplier": 1
    },
    "color": {
        "start": "#ffffff",
        "end": "#f52ebd"
    },
    "speed": {
        "start": 200,
        "end": 100,
        "minimumSpeedMultiplier": 1
    },
    "acceleration": {
        "x": 0,
        "y": 0
    },
    "maxSpeed": 0,
    "startRotation": {
        "min": 160,
        "max": 200
    },
    "noRotation": false,
    "rotationSpeed": {
        "min": 0,
        "max": 0
    },
    "lifetime": {
        "min": 0.5,
        "max": 0.5
    },
    "blendMode": "normal",
    "frequency": 0.001,
    "emitterLifetime": 0.1,
    "maxParticles": 1000,
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
    }
};
//# sourceMappingURL=GameEvents.js.map