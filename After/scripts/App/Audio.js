var After;
(function (After) {
    var App;
    (function (App) {
        class Audio {
            constructor() {
                this.Context = new AudioContext();
            }
            PlaySound(SourceFile, ShowLoading, Callback) {
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
                };
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
                };
                After.Audio.PlaySource.load();
            }
            ;
            LoadSound(SourceFile, ShowLoading, Callback) {
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
                };
                After.Audio.PlaySource.oncanplay = function () {
                    var source = After.Audio.Context.createMediaElementSource(After.Audio.PlaySource);
                    source.connect(After.Audio.Context.destination);
                    if (ShowLoading) {
                        After.Utilities.RemoveLoading();
                    }
                    if (Callback) {
                        Callback();
                    }
                };
                After.Audio.PlaySource.load();
            }
            ;
            StopSound() {
                if (After.Audio.PlaySource != null) {
                    After.Audio.PlaySource.pause();
                }
            }
            PlayLoop(SourceFile, ShowLoading, Callback) {
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
                };
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
                };
                After.Audio.LoopSource.load();
            }
            ;
            LoadLoop(SourceFile, ShowLoading, Callback) {
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
                };
                After.Audio.LoopSource.oncanplay = function () {
                    var source = After.Audio.Context.createMediaElementSource(After.Audio.LoopSource);
                    source.connect(After.Audio.Context.destination);
                    if (ShowLoading) {
                        After.Utilities.RemoveLoading();
                    }
                    if (Callback) {
                        Callback();
                    }
                };
                After.Audio.LoopSource.load();
            }
            ;
            StopLoop() {
                if (After.Audio.LoopSource != null) {
                    After.Audio.LoopSource.pause();
                }
            }
        }
        App.Audio = Audio;
    })(App = After.App || (After.App = {}));
})(After || (After = {}));
