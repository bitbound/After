function raiseParticle() {
    try {
        var imageWidth = document.getElementById("imgTunnel").clientWidth

        for (var i = 0; i < 60; i++) {
            window.setTimeout(function () {
                var startLeft = Math.random() * -(imageWidth * .25);
                var part = document.createElement("div");
                part.classList.add("particle");
                part.style.transform = "translate(" + startLeft + "px, -125px)";
                document.getElementById("divParticles").appendChild(part);
            }, 100 * i);
        }
       
    }
    catch (ex) { }
}

function streamAudio(sourceFile:string) {
    var audio = document.createElement("audio");
    audio.classList.add("audio-stream-loop");
    audio.src = sourceFile;
    audio.loop = true;
    document.body.appendChild(audio);
    audio.play();
}

$(document).ready(function () {
    streamAudio("/Assets/Sounds/ceich93_drone-ominousdistortion.mp3");
    raiseParticle();
    $('#divSplash').animate({ opacity: "1" }, 2000, function () {
        $('#imgTunnel').addClass("glowing");
    });
})