import { Utilities } from "../App/Utilities.js";
import { Sound } from "../App/Sound.js";

var introSoulEmitter: PIXI.particles.Emitter;
var introFlybyEmitter: PIXI.particles.Emitter;
var app: PIXI.Application;
var introSoulEmitterConfig = {
    "alpha": {
        "start": 1,
        "end": 0.15
    },
    "scale": {
        "start": 1,
        "end": .25,
        "minimumScaleMultiplier": 1
    },
    "color": {
        "start": "#ffffff",
        "end": window["soulColor"]
    },
    "speed": {
        "start": 50,
        "end": 50,
        "minimumSpeedMultiplier": 0.1
    },
    "acceleration": {
        "x": -150,
        "y": -75
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
        "min": .75,
        "max": 1.75
    },
    "blendMode": "normal",
    "frequency": 0.001,
    "emitterLifetime": -1,
    "maxParticles": 500,
    "pos": {
        "x": 400,
        "y": 300
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
var introFlybyEmitterConfig = {
    "alpha": {
        "start": 1,
        "end": 1
    },
    "scale": {
        "start": 0.1,
        "end": 0.1,
        "minimumScaleMultiplier": 1
    },
    "color": {
        "start": "#fdfdfd",
        "end": "#fdfdfd"
    },
    "speed": {
        "start": 250,
        "end": 250,
        "minimumSpeedMultiplier": 0.5
    },
    "acceleration": {
        "x": 0,
        "y": 0
    },
    "maxSpeed": 0,
    "startRotation": {
        "min": 190,
        "max": 210
    },
    "noRotation": false,
    "rotationSpeed": {
        "min": 0,
        "max": 0
    },
    "lifetime": {
        "min": 10,
        "max": 20
    },
    "blendMode": "normal",
    "frequency": 0.1,
    "emitterLifetime": -1,
    "maxParticles": 500,
    "pos": {
        "x": 0,
        "y": 610
    },
    "addAtBack": false,
    "spawnType": "rect",
    "spawnRect": {
        "x": 0,
        "y": 0,
        "w": 800,
        "h": 0
    },
    "autoUpdate": true
};

function createRenderer() {
    app = new PIXI.Application({
        view: document.querySelector("#introCanvas"),
        transparent: true
    });
    app.renderer.plugins.interaction.autoPreventDefault = false;
    introSoulEmitter = new PIXI.particles.Emitter(app.stage, ["/Assets/Images/particle.png"], introSoulEmitterConfig);
    introFlybyEmitter = new PIXI.particles.Emitter(app.stage, ["/Assets/Images/particle.png"], introFlybyEmitterConfig);
    var config2 = JSON.parse(JSON.stringify(introFlybyEmitterConfig));
    config2.pos.x = 810;
    config2.pos.y = 0;
    config2.spawnRect = {
        "x": 0,
        "y": 0,
        "w": 0,
        "h": 600
    };
    new PIXI.particles.Emitter(app.stage, ["/Assets/Images/particle.png"], config2);
}

createRenderer();
Sound.PlayLoop("/Assets/Sounds/ceich93__drone-darkemptiness.mp3", null);

document.querySelectorAll("div.hidden").forEach((value, index) => {
    window.setTimeout((value) => {
        $(value).hide();
        $(value).removeClass("hidden");
        $(value).fadeIn(1500);
    }, (index + 1) * 2000, value);
});