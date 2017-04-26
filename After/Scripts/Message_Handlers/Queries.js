var After;
(function (After) {
    var Message_Handlers;
    (function (Message_Handlers) {
        var Queries;
        (function (Queries) {
            function HandleStatUpdate(jsonMessage) {
                After.Me[jsonMessage.Stat] = jsonMessage.Amount;
                After.Game.UpdateStatsUI();
            }
            Queries.HandleStatUpdate = HandleStatUpdate;
            function HandlePlayerUpdate(jsonMessage) {
                for (var stat in jsonMessage.Player) {
                    After.Me[stat] = jsonMessage.Player[stat];
                }
                After.Game.UpdateStatsUI();
            }
            Queries.HandlePlayerUpdate = HandlePlayerUpdate;
            function HandleFirstLoad(jsonMessage) {
                for (var stat in jsonMessage.Player) {
                    After.Me[stat] = jsonMessage.Player[stat];
                }
                After.Drawing.AnimateParticles();
                jsonMessage.Souls.forEach(function (value, index) {
                    var soul = After.Models.Game.Soul.Create(value);
                    After.World_Data.Souls.push(soul);
                });
                jsonMessage.Areas.forEach(function (value, index) {
                    var area = After.Models.Game.Area.Create(value);
                    After.World_Data.Areas.push(area);
                });
                After.Game.UpdateStatsUI();
                After.Canvas.CenterOnCoords(After.Me.XCoord, After.Me.YCoord, true, false);
            }
            Queries.HandleFirstLoad = HandleFirstLoad;
        })(Queries = Message_Handlers.Queries || (Message_Handlers.Queries = {}));
    })(Message_Handlers = After.Message_Handlers || (After.Message_Handlers = {}));
})(After || (After = {}));
//# sourceMappingURL=Queries.js.map