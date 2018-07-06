import Utilities from "../App/Utilities.js";
var redInput = document.querySelector("#inputRed");
var greenInput = document.querySelector("#inputGreen");
var blueInput = document.querySelector("#inputBlue");
var selectColor = document.querySelector("#selectColor");
var soulColorInput = document.querySelector("#soulColorInput");
var app;
var emitterRight;
var emitterLeft;
var eyelidRight;
var eyelidLeft;
var eyeEmitterConfig = {
    "alpha": {
        "start": 1,
        "end": 0.15
    },
    "scale": {
        "start": 0.75,
        "end": 0.75,
        "minimumScaleMultiplier": 1
    },
    "color": {
        "start": "#ffffff",
        "end": "#808080"
    },
    "speed": {
        "start": 30,
        "end": 30,
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
        "min": 0.5,
        "max": 1.5
    },
    "blendMode": "normal",
    "frequency": 0.001,
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
        "r": 0
    },
    "autoUpdate": true
};
function applyEventListeners() {
    selectColor.onchange = colorSelected;
    redInput.onchange = evaluateColor;
    greenInput.onchange = evaluateColor;
    blueInput.onchange = evaluateColor;
}
function evaluateColor() {
    selectColor.selectedIndex = 0;
    while (Number(redInput.value) + Number(greenInput.value) + Number(blueInput.value) < 125) {
        redInput.value = String(Number(redInput.value) + 1);
        greenInput.value = String(Number(greenInput.value) + 1);
        blueInput.value = String(Number(blueInput.value) + 1);
    }
    soulColorInput.value = `rgb(${redInput.value}, ${greenInput.value}, ${blueInput.value})`;
    changeEmitterColor([Number(redInput.value), Number(greenInput.value), Number(blueInput.value)]);
}
function colorSelected() {
    if (selectColor.value == "") {
        redInput.value = "125";
        greenInput.value = "125";
        blueInput.value = "125";
        return;
    }
    var hexColor = Utilities.ColorNameToHex(selectColor.value);
    var rgbColor = Utilities.HexToRGB(hexColor);
    soulColorInput.value = rgbColor;
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
    var defaultPortrait = PIXI.Sprite.from("/Assets/Images/Portraits/DefaultPortrait-Short2.png");
    app.stage.addChild(defaultPortrait);
    emitterLeft = new PIXI.particles.Emitter(app.stage, ["/Assets/Images/particle.png"], eyeEmitterConfig);
    emitterRight = new PIXI.particles.Emitter(app.stage, ["/Assets/Images/particle.png"], eyeEmitterConfig);
    emitterLeft.updateSpawnPos(app.screen.width / 2 - 65, 220);
    emitterRight.updateSpawnPos(app.screen.width / 2 + 65, 220);
}
function changeEmitterColor(rgb) {
    emitterLeft.startColor.next.value.r = rgb[0];
    emitterLeft.startColor.next.value.g = rgb[1];
    emitterLeft.startColor.next.value.b = rgb[2];
    emitterRight.startColor.next.value.r = rgb[0];
    emitterRight.startColor.next.value.g = rgb[1];
    emitterRight.startColor.next.value.b = rgb[2];
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
//# sourceMappingURL=CharacterCreate.js.map