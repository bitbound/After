var After;
(function (After) {
    After.Debug = false;
    After.Temp = {};
    After.Audio = new After.App.Audio();
    After.Canvas = new After.App.Canvas();
    After.Connection = new After.App.Connection();
    After.Drawing = new After.App.Drawing();
    After.Game = new After.App.Game();
    After.Me = new After.App.Me();
    After.Settings = new After.App.Settings();
    After.Utilities = new After.App.Utilities();
})(After || (After = {}));
(function (After) {
    var World_Data;
    (function (World_Data) {
        World_Data.Areas = new Array();
        World_Data.Souls = new Array();
        World_Data.FreeParticles = new Array();
        World_Data.Landmarks = new Array();
    })(World_Data = After.World_Data || (After.World_Data = {}));
})(After || (After = {}));
