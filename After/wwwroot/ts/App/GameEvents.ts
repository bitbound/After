import { Main } from "../Main.js";
import { GameEvent } from "../Models/GameEvent.js";
import { Character } from "../Models/Character.js";
import { PixiHelper } from "./PixiHelper.js";

export const GameEvents = new class {
    ProcessEvent(gameEvent: GameEvent) {
        this["Show" + gameEvent.EventName](gameEvent);
    }
    ShowSoulDestroyed(gameEvent: GameEvent) {
        var characterID = gameEvent.EventData["CharacterID"];
        if (characterID == Main.Me.Character.ID) {
            // TODO
            //Main.UI.FloatMessage();
            Main.Me.Character.Emitter.destroy();
            Main.Me.Character.WrapperContainer.parent.removeChild(Main.Me.Character.WrapperContainer);
            Main.Me.Character.RenderDead();
        }
        else {
            var destroyedCharacter = Main.Me.Scene.GameObjects.find(x => x.ID == characterID);
            if (destroyedCharacter != null) {
                destroyedCharacter.WrapperContainer.parent.removeChild(destroyedCharacter.WrapperContainer);
                (destroyedCharacter as Character).Emitter.destroy();
                (destroyedCharacter as Character).RenderDead();
            }

        }

        characterExplosionConfig.color.end = gameEvent.EventData["Color"];
        characterExplosionConfig.pos = PixiHelper.GetEventPoint(gameEvent.XCoord, gameEvent.YCoord);
        var eventWrapper = new PIXI.Container();
        Main.Renderer.EventContainer.addChild(eventWrapper);
        var emitter = new PIXI.particles.Emitter(eventWrapper, ["/Assets/Images/particle.png"], characterExplosionConfig);
        emitter.playOnceAndDestroy();
    }
    ShowProjectileDestroyed(gameEvent: GameEvent) {
        projectileHitConfig.color.end = gameEvent.EventData["Color"];
        projectileHitConfig.pos = PixiHelper.GetEventPoint(gameEvent.XCoord, gameEvent.YCoord);
        projectileHitConfig.startRotation = {
            max: gameEvent.EventData["Angle"] + 15,
            min: gameEvent.EventData["Angle"] - 15
        }
        var eventWrapper = new PIXI.Container();
        Main.Renderer.EventContainer.addChild(eventWrapper);
        var emitter = new PIXI.particles.Emitter(eventWrapper, ["/Assets/Images/Sparks.png"], projectileHitConfig);
        emitter.playOnceAndDestroy();
    }
    ShowProjectileFired(gameEvent: GameEvent) {
        projectileFireConfig.color.end = gameEvent.EventData["Color"];
        projectileFireConfig.pos = PixiHelper.GetEventPoint(gameEvent.XCoord, gameEvent.YCoord);
        var eventWrapper = new PIXI.Container();
        Main.Renderer.EventContainer.addChild(eventWrapper);
        var emitter = new PIXI.particles.Emitter(eventWrapper, ["/Assets/Images/Sparks.png"], projectileFireConfig);
        emitter.playOnceAndDestroy();
    }
    ShowSoulReturned(gameEvent: GameEvent) {
        var characterID = gameEvent.EventData["CharacterID"];
        if (characterID == Main.Me.Character.ID) {
            Main.Me.Character.Emitter.destroy();
            Main.Me.Character.WrapperContainer.parent.removeChild(Main.Me.Character.WrapperContainer);
            Main.Me.Character.Render();
        }
        else {
            var destroyedCharacter = Main.Me.Scene.GameObjects.find(x => x.ID == characterID);
            if (destroyedCharacter != null) {
                destroyedCharacter.WrapperContainer.parent.removeChild(destroyedCharacter.WrapperContainer);
                (destroyedCharacter as Character).Emitter.destroy();
                (destroyedCharacter as Character).Render();
            }

        }
    }
}


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
        "start": 250,
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
        "min": 0.75,
        "max": 0.75
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
}

var projectileHitConfig = {
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
        "start": "#000000",
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
}


var projectileFireConfig = {
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
        "start": 100,
        "end": 75,
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
        "min": 0.25,
        "max": 0.3
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
}