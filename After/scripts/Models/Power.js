var After;
(function (After) {
    var Models;
    (function (Models) {
        class Power {
            constructor() {
                this.TargetList = new Array();
            }
        }
        Models.Power = Power;
        var Targets;
        (function (Targets) {
            Targets[Targets["Self"] = 0] = "Self";
            Targets[Targets["Character"] = 1] = "Character";
            Targets[Targets["Player"] = 2] = "Player";
            Targets[Targets["Location"] = 3] = "Location";
        })(Targets || (Targets = {}));
    })(Models = After.Models || (After.Models = {}));
})(After || (After = {}));
