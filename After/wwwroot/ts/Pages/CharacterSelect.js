export default {};
var app;
var emitter;
var characterPreviewEmitterConfig = {
    "alpha": {
        "start": 1,
        "end": 0.15
    },
    "scale": {
        "start": 2,
        "end": 2,
        "minimumScaleMultiplier": 1
    },
    "color": {
        "start": "#ffffff",
        "end": "#808080"
    },
    "speed": {
        "start": 50,
        "end": 40,
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
        "min": 1.0,
        "max": 2.5
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
function changeEmitterColor(rgb) {
    emitter.startColor.next.value.r = rgb[0];
    emitter.startColor.next.value.g = rgb[1];
    emitter.startColor.next.value.b = rgb[2];
}
function selectCharacter(e) {
    document.querySelector("#divCharacterPreview").removeAttribute("hidden");
    var rgbColor = e.currentTarget.getAttribute("character-color");
    var red = Number(rgbColor.replace("rgb(", "").split(",")[0]);
    var green = Number(rgbColor.split(",")[1]);
    var blue = Number(rgbColor.replace(")", "").split(",")[2]);
    changeEmitterColor([red, green, blue]);
}
function createRenderer() {
    app = new PIXI.Application({
        view: document.querySelector("#previewCharacterCanvas"),
        transparent: true
    });
    emitter = new PIXI.particles.Emitter(app.stage, ["/Assets/Images/particle.png"], characterPreviewEmitterConfig);
    emitter.updateSpawnPos(app.screen.width / 2, app.screen.height / 2);
}
document.querySelectorAll(".character-selector").forEach((value) => {
    value.addEventListener("click", (e) => { selectCharacter(e); });
});
createRenderer();
//# sourceMappingURL=CharacterSelect.js.map