namespace After.Models.App {
    export class Audio {
        constructor() {
            this.Context = new AudioContext();
        }
        Context: AudioContext;
        PlaySource: AudioBufferSourceNode;
        LoopSource: AudioBufferSourceNode;

        PlaySound(SourceFile: string, Callback: () => void): void {
            After.Utilities.ShowLoading();
            After.Audio.Context = After.Audio.Context || new AudioContext();
            var audioCtx = After.Audio.Context;
            After.Audio.PlaySource = audioCtx.createBufferSource();
            var source = After.Audio.PlaySource;
            source.loop = false;
            var request = new XMLHttpRequest();
            request.responseType = "arraybuffer";
            request.open("GET", SourceFile, true);
            request.onload = function () {
                audioCtx.decodeAudioData(request.response, function (buffer) {
                    source.buffer = buffer;
                    source.connect(audioCtx.destination);
                    source.start(0);
                    After.Utilities.RemoveLoading();
                    if (Callback) {
                        Callback();
                    }
                })
            }
            request.send();
        };
        LoadSound(SourceFile: string, Callback: () => void) {
            After.Utilities.ShowLoading();
            After.Audio.Context = After.Audio.Context || new AudioContext();
            var audioCtx = After.Audio.Context;
            After.Audio.PlaySource = audioCtx.createBufferSource();
            var source = After.Audio.PlaySource;
            source.loop = false;
            var request = new XMLHttpRequest();
            request.responseType = "arraybuffer";
            request.open("GET", SourceFile, true);
            request.onload = function () {
                audioCtx.decodeAudioData(request.response, function (buffer) {
                    source.buffer = buffer;
                    source.connect(audioCtx.destination);
                    After.Utilities.RemoveLoading();
                    if (Callback) {
                        Callback();
                    }
                })
            }
            request.send();
        };
        StopSound(): void {
            if (After.Audio.PlaySource.buffer != null) {
                After.Audio.PlaySource.stop();
                After.Audio.PlaySource.disconnect();
            }
        }
        LoopSound(SourceFile: string, Callback: () => void): void {
            After.Utilities.ShowLoading();
            After.Audio.Context = After.Audio.Context || new AudioContext();
            var audioCtx = After.Audio.Context;
            After.Audio.LoopSource = audioCtx.createBufferSource();
            var source = After.Audio.LoopSource;
            source.loop = true;
            var request = new XMLHttpRequest();
            request.responseType = "arraybuffer";
            request.open("GET", SourceFile, true);
            request.onload = function () {
                audioCtx.decodeAudioData(request.response, function (buffer) {
                    source.buffer = buffer;
                    source.connect(audioCtx.destination);
                    source.start(0);
                    After.Utilities.RemoveLoading();
                    if (Callback) {
                        Callback();
                    }
                })
            }
            request.send();
        };
        LoadLoop(SourceFile: string, Callback: () => void) {
            After.Utilities.ShowLoading();
            After.Audio.Context = After.Audio.Context || new AudioContext();
            var audioCtx = After.Audio.Context;
            After.Audio.LoopSource = audioCtx.createBufferSource();
            var source = After.Audio.LoopSource;
            source.loop = false;
            var request = new XMLHttpRequest();
            request.responseType = "arraybuffer";
            request.open("GET", SourceFile, true);
            request.onload = function () {
                audioCtx.decodeAudioData(request.response, function (buffer) {
                    source.buffer = buffer;
                    source.connect(audioCtx.destination);
                    After.Utilities.RemoveLoading();
                    if (Callback) {
                        Callback();
                    }
                })
            }
            request.send();
        };
        StopLoop():void {
            if (After.Audio.LoopSource.buffer != null) {
                After.Audio.LoopSource.stop();
                After.Audio.LoopSource.disconnect();
            }
        }
    }
}