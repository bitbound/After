var After;
(function (After) {
    var Models;
    (function (Models) {
        var Game;
        (function (Game) {
            class Soul {
                constructor() {
                    this.Type = "Soul";
                    this.Name = "";
                    this.XCoord = 0;
                    this.YCoord = 0;
                    this.ZCoord = "0";
                    this.CurrentX = 0;
                    this.CurrentY = 0;
                    this.Color = "";
                    this.Owner = "";
                    this.Particles = new Array();
                    this.Interval = window.setInterval(function () {
                    }, 25);
                }
                ;
            }
            Game.Soul = Soul;
        })(Game = Models.Game || (Models.Game = {}));
    })(Models = After.Models || (After.Models = {}));
})(After || (After = {}));
//# sourceMappingURL=Soul.js.map