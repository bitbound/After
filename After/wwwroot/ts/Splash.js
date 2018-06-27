function raiseParticle() {
    try {
        for (var i = 0; i < 60; i++) {
            window.setTimeout(function () {
                var startLeft = Math.random() * -45;
                var part = document.createElement("div");
                part.classList.add("particle");
                part.style.transform = "translate(" + startLeft + "px, -130px)";
                document.getElementById("divParticles").appendChild(part);
            }, 100 * i);
        }
    }
    catch (ex) { }
}
function playAudio(sourceFile) {
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
    };
    request.send();
}
playAudio("/Assets/Sounds/ceich93_drone-ominousdistortion.mp3");
raiseParticle();
//# sourceMappingURL=Splash.js.map