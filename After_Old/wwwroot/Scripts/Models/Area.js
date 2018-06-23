var After;
(function (After) {
    var Models;
    (function (Models) {
        class Area {
            constructor(XCoord, YCoord, ZCoord) {
                this.XCoord = XCoord;
                this.YCoord = YCoord;
                this.ZCoord = ZCoord;
                this.Color = "gray";
                this.IsSelected = false;
                this.IsVisible = false;
                this.Occupants = new Array();
                this.IsInteractButtonDepressed = false;
            }
        }
        Models.Area = Area;
    })(Models = After.Models || (After.Models = {}));
})(After || (After = {}));
