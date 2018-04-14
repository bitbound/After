function raiseParticle() {
    try {
        var rectList = document.getElementById("imgTunnel").getBoundingClientRect();
        var riseHeight = $("#imgTunnel").height() * .8;
        var randomLeft = Math.random() * ($("#imgTunnel").width() * .20) + ($("#imgTunnel").width() * .25);
        var startLeft = Math.round(randomLeft + rectList.left);
        var startTop = Math.round(rectList.top + $("#imgTunnel").height() * .45);
        var part = document.createElement("div");
        $(part).css({
            height: "1px",
            width: "1px",
            left: startLeft,
            top: startTop,
            "border-radius": "100%",
            position: "absolute",
            "background-color": "black"
        });
        document.getElementById("divEffects").appendChild(part);
        $(part).animate({
            height: "6px",
            width: "6px",
            "top": "-=" + riseHeight,
            "opacity": "0",
            "background-color": "gray"
        }, 3000, function () {
            $(part).remove();
        });
        window.setTimeout(function () {
            if ($("#divSplash").length > 0) {
                raiseParticle();
            }
        }, 100);
    }
    catch (ex) { }
}
function streamAudio(sourceFile) {
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
});
