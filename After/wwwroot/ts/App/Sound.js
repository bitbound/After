import { Utilities } from "./Utilities.js";
export const Sound = new class {
    constructor() {
        this.Context = new AudioContext();
        this.AudioElements = new Array();
        this.SourceNodes = new Array();
        this.Context = new AudioContext();
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
};
//# sourceMappingURL=Sound.js.map