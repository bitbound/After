import Utilities from "./App/Utilities.js";
var soulColor = "gray";
var redInput = document.querySelector("#inputRed");
var greenInput = document.querySelector("#inputGreen");
var blueInput = document.querySelector("#inputBlue");
var selectColor = document.querySelector("#selectColor");
var irises = document.querySelectorAll(".iris-color");
var eyeLids = document.querySelectorAll(".eye-lid");
function evaluateColor() {
    selectColor.selectedIndex = 0;
    while (Number(redInput.value) + Number(greenInput.value) + Number(blueInput.value) < 125) {
        redInput.value = String(Number(redInput.value) + 1);
        greenInput.value = String(Number(greenInput.value) + 1);
        blueInput.value = String(Number(blueInput.value) + 1);
    }
    soulColor = `rgb(${redInput.value}, ${greenInput.value}, ${blueInput.value})`;
    document.querySelectorAll(".iris-color").forEach(x => x.style.stopColor = soulColor);
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
    soulColor = rgbColor;
    redInput.value = rgbColor.replace("rgb(", "").split(",")[0];
    greenInput.value = rgbColor.split(",")[1];
    blueInput.value = rgbColor.replace(")", "").split(",")[2];
    document.querySelectorAll(".iris-color").forEach(x => x.style.stopColor = soulColor);
}
function initRenderer() {
    var app = new PIXI.Application({
        view: document.querySelector("#previewCanvas")
    });
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
populateColors();
initRenderer();
//function blink() {
//    document.querySelector(".eye-lid").animate({
//        "height": "30px"
//    }, 500, function () {
//        document.querySelector(".eye-lid").animate({
//            "height": "0"
//        }, 500);
//    });
//    var waitTime = Math.random() * 3000 + 1500;
//    window.setTimeout(function () {
//        if (document.querySelector(".eye-lid").length > 0) {
//            blink();
//        }
//    }, waitTime)
//}
//var xhr = new XMLHttpRequest();
//xhr.open("get", "/Assets/JSON/ColorNames.json");
//xhr.onload = e => {
//    var colorNames = JSON.parse(xhr.responseText) as Array<string>;
//    colorNames.forEach(function (value, index) {
//        var option = document.createElement("option");
//        option.innerHTML = value;
//        option.value = value;
//        option.style.color = value;
//        selectColor.appendChild(option);
//        //blink();
//    });
//}
//xhr.send();
//# sourceMappingURL=CharacterCreate.js.map