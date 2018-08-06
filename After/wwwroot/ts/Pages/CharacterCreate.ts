import { Utilities } from "../App/Utilities.js";

var redInput = document.querySelector("#inputRed") as HTMLInputElement;
var greenInput = document.querySelector("#inputGreen") as HTMLInputElement;
var blueInput = document.querySelector("#inputBlue") as HTMLInputElement;
var selectColor = document.querySelector("#selectColor") as HTMLSelectElement;
var soulColorInput = document.querySelector("#soulColorInput") as HTMLInputElement;

var app: PIXI.Application;
var emitterRight: PIXI.particles.Emitter;
var emitterLeft: PIXI.particles.Emitter;
var eyelidRight: PIXI.Graphics;
var eyelidLeft: PIXI.Graphics;
var eyeEmitterConfig = {
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
                "value": 0.75,
                "time": 1
            }
        ],
        "isStepped": false,
        "minimumScaleMultiplier": 0.25
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
                "value": 30,
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
        "x": 1,
        "y": 1
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
        "min": 1,
        "max": 1.5
    },
    "blendMode": "normal",
    "frequency": 0.001,
    "emitterLifetime": -1,
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
        "r": 0
    },
    "autoUpdate": true
};

function applyEventListeners() {
    selectColor.onchange = presetColorSelected;
    redInput.onchange = colorSliderChanged;
    greenInput.onchange = colorSliderChanged;
    blueInput.onchange = colorSliderChanged;
}

function colorSliderChanged() {
    selectColor.selectedIndex = 0;
    while (Number(redInput.value) + Number(greenInput.value) + Number(blueInput.value) < 125) {
        redInput.value = String(Number(redInput.value) + 1);
        greenInput.value = String(Number(greenInput.value) + 1);
        blueInput.value = String(Number(blueInput.value) + 1);
    }
    var hexString = PIXI.utils.hex2string(
        PIXI.utils.rgb2hex(
            [
                Number(redInput.value) / 255,
                Number(greenInput.value) / 255,
                Number(blueInput.value) / 255
            ])
    );
    soulColorInput.value = hexString;
    sessionStorage["NewSoulColor"] = hexString;
    changeEmitterColor([Number(redInput.value), Number(greenInput.value), Number(blueInput.value)]);
}

function presetColorSelected() {
    if (selectColor.value == "") {
        redInput.value = "125";
        greenInput.value = "125";
        blueInput.value = "125";
        return;
    }
    var hexColor = Utilities.ColorNameToHex(selectColor.value);
    var rgbColor = Utilities.HexToRGB(hexColor);
    soulColorInput.value = hexColor;
    sessionStorage["NewSoulColor"] = hexColor;
    redInput.value = rgbColor.replace("rgb(", "").split(",")[0];
    greenInput.value = rgbColor.split(",")[1];
    blueInput.value = rgbColor.replace(")", "").split(",")[2];
    changeEmitterColor([Number(redInput.value), Number(greenInput.value), Number(blueInput.value)]);
}

function createRenderer() {
    app = new PIXI.Application({
        view: document.querySelector("#previewCanvas"),
        transparent: true
    });
    app.renderer.plugins.interaction.autoPreventDefault = false;
    var defaultPortrait = PIXI.Sprite.from("/Assets/Images/Portraits/DefaultPortrait-Short2.png");
    app.stage.addChild(defaultPortrait);

    emitterLeft = new PIXI.particles.Emitter(app.stage, ["/Assets/Images/particle.png"], eyeEmitterConfig);
    emitterRight = new PIXI.particles.Emitter(app.stage, ["/Assets/Images/particle.png"], eyeEmitterConfig);

    emitterLeft.updateSpawnPos(app.screen.width / 2 - 65, 220);
    emitterRight.updateSpawnPos(app.screen.width / 2 + 65, 220);
}


function changeEmitterColor(rgb: number[]) {
    (emitterLeft.startColor.next.value as PIXI.particles.Color).r = rgb[0];
    (emitterLeft.startColor.next.value as PIXI.particles.Color).g = rgb[1];
    (emitterLeft.startColor.next.value as PIXI.particles.Color).b = rgb[2];
    (emitterRight.startColor.next.value as PIXI.particles.Color).r = rgb[0];
    (emitterRight.startColor.next.value as PIXI.particles.Color).g = rgb[1];
    (emitterRight.startColor.next.value as PIXI.particles.Color).b = rgb[2];
}

function populateColors() {
    selectColor.appendChild(document.createElement("option"));
    Utilities.ColorNames.forEach(function (value, index) {
        var option = document.createElement("option");
        option.innerHTML = value;
        option.value = value;
        option.style.color = value;
        selectColor.appendChild(option);
    });
}

function randomAcceleration() {
    var x = Utilities.GetRandom(0, 50, true);
    var y = Utilities.GetRandom(-50, 0, true);
    emitterLeft.acceleration.x = x;
    emitterLeft.acceleration.y = y;
    emitterRight.acceleration.x = x;
    emitterRight.acceleration.y = y;

    window.setTimeout(() => {
        emitterLeft.acceleration.x = 0;
        emitterLeft.acceleration.y = 0;
        emitterRight.acceleration.x = 0;
        emitterRight.acceleration.y = 0;
    }, 500);
    window.setTimeout(randomAcceleration, Utilities.GetRandom(1500, 4000, true));
}

applyEventListeners();
populateColors();
createRenderer();
window.setTimeout(randomAcceleration, 2000);