﻿import { Sound } from "../App/Sound.js";

export default {};

var splashEmitter: PIXI.particles.Emitter;
var app: PIXI.Application;
var splashEmitterConfig = {
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
                "value": 0.05,
                "time": 0
            },
            {
                "value": 0.1,
                "time": 1
            }
        ],
        "isStepped": false,
        "minimumScaleMultiplier": 0.5
    },
    "color": {
        "list": [
            {
                "value": "#000000",
                "time": 0
            },
            {
                "value": "#c2c2c2",
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
                "value": 100,
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
        "min": 260,
        "max": 280
    },
    "noRotation": false,
    "rotationSpeed": {
        "min": 0,
        "max": 0
    },
    "lifetime": {
        "min": 1,
        "max": 9
    },
    "blendMode": "normal",
    "frequency": 0.1,
    "emitterLifetime": -1,
    "maxParticles": 750,
    "pos": {
        "x": 80,
        "y": 150
    },
    "addAtBack": false,
    "spawnType": "rect",
    "spawnRect": {
        "x": -25,
        "y": 0,
        "w": 50,
        "h": 0
    },
    "autoUpdate": true
};

function createRenderer() {
    (document.querySelector("#splashCanvas") as HTMLCanvasElement).style.maxWidth = "200px";
    app = new PIXI.Application({
        view: document.querySelector("#splashCanvas"),
        transparent: true,
        width: 224,
        height: 329
    });
    app.renderer.plugins.interaction.autoPreventDefault = false;
    var tunnelImage = PIXI.Sprite.from("/Assets/Images/Tunnel and Shadow.png");
    app.stage.addChild(tunnelImage);
    splashEmitter = new PIXI.particles.Emitter(app.stage, ["/Assets/Images/particle.png"], splashEmitterConfig);
}

function playAudio(sourceFile: string) {
    var audioCtx = new AudioContext();
    var source = audioCtx.createBufferSource();
    source.loop = true;
    var request = new XMLHttpRequest();
    request.responseType = "arraybuffer";
    request.open("GET", sourceFile, true);
    request.onload = function () {
        audioCtx.decodeAudioData(request.response, function (buffer) {
            source.buffer = buffer;
            source.connect(audioCtx.destination);
            source.start(0);
        });
    }
    request.send();
}

Sound.PlaySound("/Assets/Sounds/ceich93_drone-ominousdistortion.mp3");
createRenderer();