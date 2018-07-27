import { Utilities } from "./Utilities.js";

export const Sound = new class {
    constructor() {
        this.Context = new AudioContext();
    }
    Context: AudioContext = new AudioContext();
    AudioElements: Array<HTMLAudioElement> = new Array<HTMLAudioElement>();
    SourceNodes: Array<MediaElementAudioSourceNode> = new Array<MediaElementAudioSourceNode>();

    Play(sourceFile: string, loop: boolean): string {
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
        }

        sourceNode.connect(this.Context.destination);
        audioElement.play();

        return audioElement.id;
    };
    Stop(audioID:string): void {
        var index = this.AudioElements.findIndex((value, index) => {
            return value.id == audioID;
        });
        if (index > -1) {
            this.AudioElements[index].pause();
            this.AudioElements[index].onended(null);
        }
    }
}