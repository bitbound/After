var After;
(function (After) {
    var Models;
    (function (Models) {
        class Area {
            constructor(XCoord, YCoord, ZCoord) {
                this.Type = "Area";
                this.XCoord = XCoord;
                this.YCoord = YCoord;
                this.ZCoord = ZCoord;
                this.Color = "gray";
                this.IsSelected = false;
            }
        }
        Models.Area = Area;
    })(Models = After.Models || (After.Models = {}));
})(After || (After = {}));
//# sourceMappingURL=Area.js.map