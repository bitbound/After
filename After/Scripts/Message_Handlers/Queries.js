var After;
(function (After) {
    var Message_Handlers;
    (function (Message_Handlers) {
        var Queries;
        (function (Queries) {
            function HandleStatUpdate(jsonMessage) {
                After.Me[jsonMessage.Stat] = jsonMessage.Amount;
                After.Me.UpdateStatsUI();
            }
            Queries.HandleStatUpdate = HandleStatUpdate;
            function HandlePlayerUpdate(jsonMessage) {
                for (var stat in jsonMessage.Player) {
                    if (After.Me[stat] != undefined && jsonMessage.Player[stat] != undefined) {
                        After.Me[stat] = jsonMessage.Player[stat];
                    }
                }
                After.Me.UpdateStatsUI();
            }
            Queries.HandlePlayerUpdate = HandlePlayerUpdate;
            function HandleFirstLoad(jsonMessage) {
                for (var stat in jsonMessage.Player) {
                    if (After.Me[stat] != undefined && jsonMessage.Player[stat] != undefined) {
                        After.Me[stat] = jsonMessage.Player[stat];
                    }
                }
                jsonMessage.Souls.forEach(function (value, index) {
                    var soul = new After.Models.Game.Soul();
                    for (var stat in value) {
                        soul[stat] = value[stat];
                    }
                    After.World_Data.Souls.push(soul);
                });
                jsonMessage.Areas.forEach(function (value, index) {
                    var area = new After.Models.Game.Area(value.XCoord, value.YCoord, value.ZCoord);
                    for (var prop in value) {
                        area[prop] = value[prop];
                    }
                    After.World_Data.Areas.push(area);
                });
                After.Me.UpdateStatsUI();
            }
            Queries.HandleFirstLoad = HandleFirstLoad;
        })(Queries = Message_Handlers.Queries || (Message_Handlers.Queries = {}));
    })(Message_Handlers = After.Message_Handlers || (After.Message_Handlers = {}));
})(After || (After = {}));
//# sourceMappingURL=Queries.js.map