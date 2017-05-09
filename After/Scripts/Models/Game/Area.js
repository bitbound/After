var After;
(function (After) {
    var Models;
    (function (Models) {
        var Game;
        (function (Game) {
            class Area {
                constructor(XCoord, YCoord, ZCoord) {
                    this.XCoord = XCoord;
                    this.YCoord = YCoord;
                    this.ZCoord = ZCoord;
                    this.Color = "gray";
                    this.IsSelected = false;
                    this.IsVisible = false;
                    this.Occupants = new Array();
                }
            }
            Game.Area = Area;
        })(Game = Models.Game || (Models.Game = {}));
    })(Models = After.Models || (After.Models = {}));
})(After || (After = {}));
