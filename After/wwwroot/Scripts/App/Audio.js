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
                        if (ShowLoading) {
                            After.Utilities.RemoveLoading();
                        }
                        if (Callback) {
                            Callback();
                        }
                    }, function () {
                        // Error callback.
                        if (ShowLoading) {
                            After.Utilities.RemoveLoading();
                        }
                        if (Callback) {
                            Callback();
                        }
                    });
                };
                request.onerror = function () {
                    if (ShowLoading) {
                        After.Utilities.RemoveLoading();
                    }
                    if (Callback) {
                        Callback();
                    }
                };
                request.ontimeout = function () {
                    if (ShowLoading) {
                        After.Utilities.RemoveLoading();
                    }
                    if (Callback) {
                        Callback();
                    }
                };
                request.send();
            }
            ;
            LoadSound(SourceFile, ShowLoading, Callback) {
                if (ShowLoading) {
                    After.Utilities.ShowLoading();
                }
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
                        if (ShowLoading) {
                            After.Utilities.RemoveLoading();
                        }
                        if (Callback) {
                            Callback();
                        }
                    }, function () {
                        // Error callback.
                        if (ShowLoading) {
                            After.Utilities.RemoveLoading();
                        }
                        if (Callback) {
                            Callback();
                        }
                    });
                };
                request.onerror = function () {
                    if (ShowLoading) {
                        After.Utilities.RemoveLoading();
                    }
                    if (Callback) {
                        Callback();
                    }
                };
                request.ontimeout = function () {
                    if (ShowLoading) {
                        After.Utilities.RemoveLoading();
                    }
                    if (Callback) {
                        Callback();
                    }
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
            PlayLoop(SourceFile, ShowLoading, Callback) {
                if (ShowLoading) {
                    After.Utilities.ShowLoading();
                }
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
                        if (ShowLoading) {
                            After.Utilities.RemoveLoading();
                        }
                        if (Callback) {
                            Callback();
                        }
                    }, function () {
                        // Error callback.
                        if (ShowLoading) {
                            After.Utilities.RemoveLoading();
                        }
                        if (Callback) {
                            Callback();
                        }
                    });
                };
                request.onerror = function () {
                    if (ShowLoading) {
                        After.Utilities.RemoveLoading();
                    }
                    if (Callback) {
                        Callback();
                    }
                };
                request.ontimeout = function () {
                    if (ShowLoading) {
                        After.Utilities.RemoveLoading();
                    }
                    if (Callback) {
                        Callback();
                    }
                };
                request.send();
            }
            ;
            LoadLoop(SourceFile, ShowLoading, Callback) {
                if (ShowLoading) {
                    After.Utilities.ShowLoading();
                }
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
                        if (ShowLoading) {
                            After.Utilities.RemoveLoading();
                        }
                        if (Callback) {
                            Callback();
                        }
                    }, function () {
                        // Error callback.
                        if (ShowLoading) {
                            After.Utilities.RemoveLoading();
                        }
                        if (Callback) {
                            Callback();
                        }
                    });
                };
                request.onerror = function () {
                    if (ShowLoading) {
                        After.Utilities.RemoveLoading();
                    }
                    if (Callback) {
                        Callback();
                    }
                };
                request.ontimeout = function () {
                    if (ShowLoading) {
                        After.Utilities.RemoveLoading();
                    }
                    if (Callback) {
                        Callback();
                    }
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
            StreamSound(SourceFile) {
                var audio = document.createElement("audio");
                audio.classList.add("audio-stream");
                audio.src = SourceFile;
                audio.onended = function (ev) {
                    document.body.removeChild(this);
                };
                audio.play();
            }
            StreamLoop(SourceFile) {
                var audio = document.createElement("audio");
                audio.classList.add("audio-stream-loop");
                audio.src = SourceFile;
                audio.loop = true;
                audio.onended = function (ev) {
                    document.body.removeChild(this);
                };
                document.body.appendChild(audio);
                audio.play();
            }
            StopStream() {
                $("audio.audio-stream").each(function (index, elem) {
                    elem.pause();
                    $(elem).remove();
                });
            }
            StopStreamLoop() {
                $("audio.audio-stream-loop").each(function (index, elem) {
                    elem.pause();
                    $(elem).remove();
                });
            }
        }
        App.Audio = Audio;
    })(App = After.App || (After.App = {}));
})(After || (After = {}));
