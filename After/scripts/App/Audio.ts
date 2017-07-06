namespace After.App {
    export class Audio {
        constructor() {
            this.Context = new AudioContext();
        }
        Context: AudioContext;
        PlaySource: HTMLAudioElement;
        LoopSource: HTMLAudioElement;

        PlaySound(SourceFile: string, ShowLoading: boolean, Callback: () => void): void {
            if (ShowLoading) {
                After.Utilities.ShowLoading();
            }
            After.Audio.Context = After.Audio.Context || new AudioContext();
            After.Audio.PlaySource = document.createElement("audio");
            After.Audio.PlaySource.src = SourceFile;
            After.Audio.PlaySource.onerror = function () {
                if (ShowLoading) {
                    After.Utilities.RemoveLoading();
                }
                if (Callback) {
                    Callback();
                }
            }
            After.Audio.PlaySource.oncanplay = function () {
                var source = After.Audio.Context.createMediaElementSource(After.Audio.PlaySource);
                source.connect(After.Audio.Context.destination);
                After.Audio.PlaySource.play();
                if (ShowLoading) {
                    After.Utilities.RemoveLoading();
                }
                if (Callback) {
                    Callback();
                }
            }
            After.Audio.PlaySource.load();
        };
        LoadSound(SourceFile: string, ShowLoading: boolean, Callback: () => void) {
            if (ShowLoading) {
                After.Utilities.ShowLoading();
            }
            After.Audio.Context = After.Audio.Context || new AudioContext();
            After.Audio.PlaySource = document.createElement("audio");
            After.Audio.PlaySource.src = SourceFile;
            After.Audio.PlaySource.onerror = function () {
                if (ShowLoading) {
                    After.Utilities.RemoveLoading();
                }
                if (Callback) {
                    Callback();
                }
            }
            After.Audio.PlaySource.oncanplay = function () {
                var source = After.Audio.Context.createMediaElementSource(After.Audio.PlaySource);
                source.connect(After.Audio.Context.destination);
                if (ShowLoading) {
                    After.Utilities.RemoveLoading();
                }
                if (Callback) {
                    Callback();
                }
            }
            After.Audio.PlaySource.load();
        };
        StopSound(): void {
            if (After.Audio.PlaySource != null) {
                After.Audio.PlaySource.pause();
            }
        }
        PlayLoop(SourceFile: string, ShowLoading: boolean, Callback: () => void): void {
            if (ShowLoading) {
                After.Utilities.ShowLoading();
            }
            After.Audio.Context = After.Audio.Context || new AudioContext();
            After.Audio.LoopSource = document.createElement("audio");
            After.Audio.LoopSource.loop = true;
            After.Audio.LoopSource.src = SourceFile;
            After.Audio.LoopSource.onerror = function () {
                if (ShowLoading) {
                    After.Utilities.RemoveLoading();
                }
                if (Callback) {
                    Callback();
                }
            }
            After.Audio.LoopSource.oncanplay = function () {
                var source = After.Audio.Context.createMediaElementSource(After.Audio.LoopSource);
                source.connect(After.Audio.Context.destination);
                After.Audio.LoopSource.play();
                if (ShowLoading) {
                    After.Utilities.RemoveLoading();
                }
                if (Callback) {
                    Callback();
                }
            }
            After.Audio.LoopSource.load();
        };
        LoadLoop(SourceFile: string, ShowLoading: boolean, Callback: () => void) {
            if (ShowLoading) {
                After.Utilities.ShowLoading();
            }
            After.Audio.Context = After.Audio.Context || new AudioContext();
            After.Audio.LoopSource = document.createElement("audio");
            After.Audio.LoopSource.loop = true;
            After.Audio.LoopSource.src = SourceFile;
            After.Audio.LoopSource.onerror = function () {
                if (ShowLoading) {
                    After.Utilities.RemoveLoading();
                }
                if (Callback) {
                    Callback();
                }
            }
            After.Audio.LoopSource.oncanplay = function () {
                var source = After.Audio.Context.createMediaElementSource(After.Audio.LoopSource);
                source.connect(After.Audio.Context.destination);
                if (ShowLoading) {
                    After.Utilities.RemoveLoading();
                }
                if (Callback) {
                    Callback();
                }
            }
            After.Audio.LoopSource.load();
        };
        StopLoop():void {
            if (After.Audio.LoopSource != null) {
                After.Audio.LoopSource.pause();
            }
        }
    }
}