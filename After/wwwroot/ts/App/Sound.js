import { Utilities } from "./Utilities.js";
export const Sound = new class {
    constructor() {
        this.AudioElements = new Array();
        this.SourceNodes = new Array();
        this.TrackList = [
            {
                Name: "Dark Emptiness",
                URL: "/Assets/Sounds/ceich93__drone-darkemptiness.mp3",
                IsBackground: true
            },
            {
                Name: "Ominous Distortion",
                URL: "/Assets/Sounds/ceich93_drone-ominousdistortion.mp3",
                IsBackground: true
            },
        ];
        this.Context = new AudioContext();
        this.BackgroundAudio = new Audio();
        this.BackgroundNode = this.Context.createMediaElementSource(this.BackgroundAudio);
        this.BackgroundNode.connect(this.Context.destination);
    }
    Play(sourceFile, loop) {
        var audioElement = new Audio(sourceFile);
        this.AudioElements.push(audioElement);
        if (loop) {
            audioElement.loop = true;
        }
        audioElement.id = Utilities.CreateGUID();
        var sourceNode = this.Context.createMediaElementSource(audioElement);
        this.SourceNodes.push(sourceNode);
        audioElement.onended = (ev) => {
            audioElement.pause();
            sourceNode.disconnect();
            Utilities.RemoveFromArray(this.AudioElements, audioElement);
            Utilities.RemoveFromArray(this.SourceNodes, sourceNode);
        };
        sourceNode.connect(this.Context.destination);
        audioElement.play();
        return audioElement.id;
    }
    ;
    Stop(audioID) {
        var index = this.AudioElements.findIndex((value, index) => {
            return value.id == audioID;
        });
        if (index > -1) {
            this.AudioElements[index].pause();
            this.AudioElements[index].onended(null);
        }
    }
    PlayBackground(trackName = null) {
        this.BackgroundAudio.pause();
        if (trackName) {
            var src = this.TrackList.find(x => x.Name == trackName).URL;
            this.BackgroundAudio.src = src;
        }
        else {
            var src = this.TrackList[Math.round(Math.random() * (this.TrackList.length - 1))].URL;
            this.BackgroundAudio.src = src;
        }
        this.BackgroundAudio.play();
    }
    StopBackground() {
        this.BackgroundAudio.pause();
    }
};
//# sourceMappingURL=Sound.js.map