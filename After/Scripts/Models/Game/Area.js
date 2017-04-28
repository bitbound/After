var After;
(function (After) {
    var Models;
    (function (Models) {
        var Game;
        (function (Game) {
            class Area {
                constructor(XCoord, YCoord, ZCoord) {
                    this.Type = "Area";
                    this.XCoord = XCoord;
                    this.YCoord = YCoord;
                    this.ZCoord = ZCoord;
                    this.Color = "gray";
                    this.IsSelected = false;
                    this.Opacity = 1;
                }
                static Create(DynamicArea) {
                    var area = new After.Models.Game.Area(DynamicArea.XCoord, DynamicArea.YCoord, DynamicArea.ZCoord);
                    for (var prop in DynamicArea) {
                        area[prop] = DynamicArea[prop];
                    }
                    return area;
                }
            }
            Game.Area = Area;
        })(Game = Models.Game || (Models.Game = {}));
    })(Models = After.Models || (After.Models = {}));
})(After || (After = {}));
//# sourceMappingURL=Area.js.map