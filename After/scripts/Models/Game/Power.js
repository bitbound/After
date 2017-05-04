var After;
(function (After) {
    var Models;
    (function (Models) {
        var Game;
        (function (Game) {
            class Power {
                constructor() {
                    this.TargetList = new Array();
                }
            }
            Game.Power = Power;
            var Targets;
            (function (Targets) {
                Targets[Targets["Self"] = 0] = "Self";
                Targets[Targets["Character"] = 1] = "Character";
                Targets[Targets["Player"] = 2] = "Player";
                Targets[Targets["Location"] = 3] = "Location";
            })(Targets || (Targets = {}));
        })(Game = Models.Game || (Models.Game = {}));
    })(Models = After.Models || (After.Models = {}));
})(After || (After = {}));
//# sourceMappingURL=Power.js.map