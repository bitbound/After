import Utilities from "../App/Utilities.js";

var app: PIXI.Application;
var emitter: PIXI.particles.Emitter;
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
  "autoUpdate":  true
};

function changeEmitterColor(rgb: number[]) {
    (emitter.startColor.next.value as PIXI.particles.Color).r = rgb[0] * 255;
    (emitter.startColor.next.value as PIXI.particles.Color).g = rgb[1] * 255;
    (emitter.startColor.next.value as PIXI.particles.Color).b = rgb[2] * 255;
}

function applyEventHandlers() {
    document.querySelector("#deleteCharacterButton").addEventListener("click", ev => {
        Utilities.ShowModal("Confirm Deletion",
            "Are you sure you want to delete this character?<br><br>THIS CANNOT BE REVERSED!",
            "<button class='btn btn-danger'>Delete</button>"
        );
    });
}

function selectCharacter(e) {
    document.querySelector("#divCharacterPreview").removeAttribute("hidden");
    var hexColor = (e.currentTarget as HTMLAnchorElement).getAttribute("character-color");
    var hexNumber = Utilities.HexStringToNumber(hexColor);
    changeEmitterColor(PIXI.utils.hex2rgb(hexNumber));
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
    value.addEventListener("click", (e) => { selectCharacter(e);})
})

applyEventHandlers();
createRenderer();