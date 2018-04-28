var After;
(function (After) {
    var Models;
    (function (Models) {
        class Soul {
            constructor() {
                this.Name = "";
                this.XCoord = 0;
                this.YCoord = 0;
                this.ZCoord = "0";
                this.Color = "gray";
            }
            ;
            get CurrentLocation() {
                if (this.XCoord == null || this.YCoord == null || this.ZCoord == null) {
                    return null;
                }
                return this.XCoord.toString() + "," + this.YCoord.toString() + "," + this.ZCoord;
            }
            ;
            set CurrentLocation(XYZ) {
                if (XYZ == null) {
                    this.XCoord = null;
                    this.YCoord = null;
                    return;
                }
                var locArray = XYZ.split(",");
                this.XCoord = Number(locArray[0]);
                this.YCoord = Number(locArray[1]);
                this.ZCoord = locArray[2];
            }
            ;
        }
        Models.Soul = Soul;
    })(Models = After.Models || (After.Models = {}));
})(After || (After = {}));
