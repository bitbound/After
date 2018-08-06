import { Main } from "../Main.js";
import { Utilities } from "../App/Utilities.js";
var app;
var emitter;
var characterPreviewEmitterConfig = {
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
                "value": 2,
                "time": 0
            },
            {
                "value": 1.5,
                "time": 1
            }
        ],
        "isStepped": false,
        "minimumScaleMultiplier": 0.1
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
                "value": 60,
                "time": 0
            },
            {
                "value": 50,
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
        "min": 0.75,
        "max": 2.0
    },
    "blendMode": "normal",
    "frequency": 0.002,
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
    emitter.startColor.next.value.r = rgb[0] * 255;
    emitter.startColor.next.value.g = rgb[1] * 255;
    emitter.startColor.next.value.b = rgb[2] * 255;
}
function applyEventHandlers() {
    document.querySelector("#deleteCharacterButton").addEventListener("click", ev => {
        Main.UI.ShowModal("Confirm Deletion", "Are you sure you want to delete this character?<br><br><strong>This cannot be reversed!</strong>", "<button id='confirmDeleteButton' class='btn btn-danger'>Delete</button>");
        document.querySelector("#confirmDeleteButton").onclick = (ev) => {
            var deleteCharacterForm = document.querySelector("#deleteCharacterForm");
            deleteCharacterForm.submit();
        };
    });
    document.querySelector("#enterButton").onclick = (ev) => {
        var characterInput = document.querySelector("#characterNameInput");
        var characterName = characterInput.value;
        location.assign("/play?character=" + characterName);
    };
}
function selectCharacter(e) {
    document.querySelector("#divCharacterPreview").removeAttribute("hidden");
    var characterInput = document.querySelector("#characterNameInput");
    characterInput.value = e.currentTarget.getAttribute("character-name");
    var hexColor = e.currentTarget.getAttribute("character-color");
    var hexNumber = Main.Utilities.HexStringToNumber(hexColor);
    changeEmitterColor(PIXI.utils.hex2rgb(hexNumber));
    Utilities.Animate(document.documentElement, "scrollTop", document.documentElement.scrollTop, document.querySelector("#divCharacterPreview").getBoundingClientRect().top, null, 200);
    Utilities.Animate(document.body, "scrollTop", document.body.scrollTop, document.querySelector("#divCharacterPreview").getBoundingClientRect().top, null, 200);
}
function createRenderer() {
    app = new PIXI.Application({
        view: document.querySelector("#previewCharacterCanvas"),
        transparent: true,
    });
    app.renderer.plugins.interaction.autoPreventDefault = false;
    emitter = new PIXI.particles.Emitter(app.stage, ["/Assets/Images/particle.png"], characterPreviewEmitterConfig);
    emitter.updateSpawnPos(app.screen.width / 2, app.screen.height / 2);
}
document.querySelectorAll(".character-selector").forEach((value) => {
    value.addEventListener("click", (e) => { selectCharacter(e); });
});
applyEventHandlers();
createRenderer();
//# sourceMappingURL=CharacterSelect.js.map