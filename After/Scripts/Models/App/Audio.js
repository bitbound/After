var After;
(function (After) {
    var Models;
    (function (Models) {
        var App;
        (function (App) {
            class Audio {
                constructor() {
                    this.Context = new AudioContext();
                }
                PlaySound(SourceFile, Callback) {
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
                        });
                    };
                    request.send();
                }
                ;
                LoadSound(SourceFile, Callback) {
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
                        });
                    };
                    request.send();
                }
                ;
                StopSound() {
                    if (After.Audio.PlaySource.buffer != null) {
                        After.Audio.PlaySource.stop();
                        After.Audio.PlaySource.disconnect();
                    }
                }
                LoopSound(SourceFile, Callback) {
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
                        });
                    };
                    request.send();
                }
                ;
                LoadLoop(SourceFile, Callback) {
                    After.Utilities.ShowLoading();
                    After.Audio.Context = After.Audio.Context || new AudioContext();
                    var audioCtx = After.Audio.Context;
                    After.Audio.LoopSource = audioCtx.createBufferSource();
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
                        });
                    };
                    request.send();
                }
                ;
                StopLoop() {
                    if (After.Audio.LoopSource.buffer != null) {
                        After.Audio.LoopSource.stop();
                        After.Audio.LoopSource.disconnect();
                    }
                }
            }
            App.Audio = Audio;
        })(App = Models.App || (Models.App = {}));
    })(Models = After.Models || (After.Models = {}));
})(After || (After = {}));
//# sourceMappingURL=Audio.js.map