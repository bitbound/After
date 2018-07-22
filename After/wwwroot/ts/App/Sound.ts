export const Sound = new class {
    constructor() {
        this.Context = new AudioContext();
    }
    Context: AudioContext;
    PlaySource: AudioBufferSourceNode;
    LoopSource: AudioBufferSourceNode;

    PlaySound(sourceFile: string) {
        this.Context = this.Context || new AudioContext();
        var audioCtx = this.Context;
        this.PlaySource = audioCtx.createBufferSource();
        var source = this.PlaySource;
        source.loop = false;
        var request = new XMLHttpRequest();
        request.responseType = "arraybuffer";
        request.open("GET", sourceFile, true);
        request.onload = function () {
            audioCtx.decodeAudioData(request.response, function (buffer) {
                source.buffer = buffer;
                source.connect(audioCtx.destination);
                source.start(0);
            });
        }
        request.send();
    }
    LoadSound(sourceFile: string) {
        this.Context = this.Context || new AudioContext();
        var audioCtx = this.Context;
        this.PlaySource = audioCtx.createBufferSource();
        var source = this.PlaySource;
        source.loop = false;
        var request = new XMLHttpRequest();
        request.responseType = "arraybuffer";
        request.open("GET", sourceFile, true);
        request.onload = function () {
            audioCtx.decodeAudioData(request.response, function (buffer) {
                source.buffer = buffer;
                source.connect(audioCtx.destination);
            });
        }
        request.send();
    };
    StopSound(): void {
        if (this.PlaySource.buffer != null) {
            this.PlaySource.stop();
            this.PlaySource.disconnect();
        }
    }
    PlayLoop(sourceFile: string) {
        this.Context = this.Context || new AudioContext();
        var audioCtx = this.Context;
        this.LoopSource = audioCtx.createBufferSource();
        var source = this.LoopSource;
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
        }
        request.send();
    };
    LoadLoop(sourceFile: string) {
        this.Context = this.Context || new AudioContext();
        var audioCtx = this.Context;
        this.LoopSource = audioCtx.createBufferSource();
        var source = this.LoopSource;
        source.loop = false;
        var request = new XMLHttpRequest();
        request.responseType = "arraybuffer";
        request.open("GET", sourceFile, true);
        request.onload = function () {
            audioCtx.decodeAudioData(request.response, function (buffer) {
                source.buffer = buffer;
                source.connect(audioCtx.destination);
            });
        }
        request.send();
    };
    StopLoop(): void {
        if (this.LoopSource.buffer != null) {
            this.LoopSource.stop();
            this.LoopSource.disconnect();
        }
    }
}