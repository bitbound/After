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
                    this.Height = 1;
                    this.Color = "gray";
                    this.Particles = new Array();
                }
                ;
            }
            Game.Soul = Soul;
        })(Game = Models.Game || (Models.Game = {}));
    })(Models = After.Models || (After.Models = {}));
})(After || (After = {}));
//# sourceMappingURL=Soul.js.map