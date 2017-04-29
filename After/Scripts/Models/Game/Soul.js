var After;
(function (After) {
    var Models;
    (function (Models) {
        var Game;
        (function (Game) {
            class Soul {
                constructor() {
                    this.Name = "";
                    this.XCoord = 0;
                    this.YCoord = 0;
                    this.ZCoord = "0";
                    this.Color = "gray";
                }
                ;
                get CurrentXYZ() {
                    if (this.XCoord == null || this.YCoord == null || this.ZCoord == null) {
                        return null;
                    }
                    return this.XCoord.toString() + "," + this.YCoord.toString() + "," + this.ZCoord;
                }
                ;
                set CurrentXYZ(XYZ) {
                    if (XYZ == null) {
                        this.XCoord = null;
                        this.YCoord = null;
                        this.ZCoord = null;
                        return;
                    }
                    var locArray = XYZ.split(",");
                    this.XCoord = Number(locArray[0]);
                    this.YCoord = Number(locArray[1]);
                    this.ZCoord = locArray[2];
                }
                ;
                static Create(DynamicSoul) {
                    var soul = new After.Models.Game.Soul();
                    for (var stat in DynamicSoul) {
                        soul[stat] = DynamicSoul[stat];
                    }
                    return soul;
                }
            }
            Game.Soul = Soul;
        })(Game = Models.Game || (Models.Game = {}));
    })(Models = After.Models || (After.Models = {}));
})(After || (After = {}));
//# sourceMappingURL=Soul.js.map