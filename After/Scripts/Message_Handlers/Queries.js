var After;
(function (After) {
    var Message_Handlers;
    (function (Message_Handlers) {
        var Queries;
        (function (Queries) {
            function HandleStatUpdate(JsonMessage) {
                After.Me[JsonMessage.Stat] = JsonMessage.Amount;
                After.Game.UpdateStatsUI();
            }
            Queries.HandleStatUpdate = HandleStatUpdate;
            function HandlePlayerUpdate(JsonMessage) {
                for (var stat in JsonMessage.Player) {
                    After.Me[stat] = JsonMessage.Player[stat];
                }
                After.Game.UpdateStatsUI();
            }
            Queries.HandlePlayerUpdate = HandlePlayerUpdate;
            function HandleRefreshView(JsonMessage) {
                JsonMessage.Souls.forEach(function (value) {
                    var index = After.World_Data.Souls.findIndex((soul) => { return soul.Name == value.Name; });
                    var soul = After.Models.Game.Soul.Create(value);
                    if (index == -1) {
                        After.World_Data.Souls.push(soul);
                    }
                    else {
                        After.World_Data.Souls[index] = soul;
                    }
                });
                After.World_Data.Areas.forEach(function (value, index) {
                    if (After.Utilities.GetDistanceBetween(value.LocationID, After.Me.CurrentXYZ) <= After.Me.ViewDistance) {
                        After.World_Data.Areas.splice(index, 1);
                    }
                });
                JsonMessage.Areas.forEach(function (value) {
                    var area = After.Models.Game.Area.Create(value);
                    After.World_Data.Areas.push(area);
                });
                After.World_Data.Areas.forEach(function (value) {
                    if (After.Utilities.GetDistanceBetween(value.LocationID, After.Me.CurrentXYZ) <= After.Me.ViewDistance) {
                        value.Opacity = 1;
                    }
                    else {
                        value.Opacity = .1;
                    }
                });
            }
            Queries.HandleRefreshView = HandleRefreshView;
            function HandleRememberLocations(JsonMessage) {
                // TODO
            }
            Queries.HandleRememberLocations = HandleRememberLocations;
        })(Queries = Message_Handlers.Queries || (Message_Handlers.Queries = {}));
    })(Message_Handlers = After.Message_Handlers || (After.Message_Handlers = {}));
})(After || (After = {}));
//# sourceMappingURL=Queries.js.map