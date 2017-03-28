var After;
(function (After) {
    After.Debug = false;
    After.Temp = {};
    After.Audio = new After.Models.App.Audio();
    After.Canvas = new After.Models.App.Canvas();
    After.Connection = new After.Models.App.Connection();
    After.Drawing = new After.Models.App.Drawing();
    After.Me = new After.Models.App.Me();
    After.Utilities = new After.Models.App.Utilities();
})(After || (After = {}));
(function (After) {
    var World_Data;
    (function (World_Data) {
        World_Data.Areas = new Array();
        World_Data.Souls = new Array();
    })(World_Data = After.World_Data || (After.World_Data = {}));
})(After || (After = {}));
//# sourceMappingURL=MainModel.js.map