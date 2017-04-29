namespace After.Message_Handlers.Queries {
    export function HandleStatUpdate(JsonMessage) {
        After.Me[JsonMessage.Stat] = JsonMessage.Amount;
        After.Game.UpdateStatsUI();
    }
    export function HandlePlayerUpdate(JsonMessage) {
        for (var stat in JsonMessage.Player) {
            After.Me[stat] = JsonMessage.Player[stat];
        }
        After.Game.UpdateStatsUI();
    }
    export function HandleRefreshView(JsonMessage) {
        JsonMessage.Souls.forEach(function (value) {
            var index = After.World_Data.Souls.findIndex((soul) => { return soul.Name == value.Name; });
            var soul = After.Models.Game.Soul.Create(value);
            if (index == -1)
            {
                After.World_Data.Souls.push(soul);
            }
            else
            {
                After.World_Data.Souls[index] = soul;
            }
        })
        After.World_Data.Areas.forEach(function (value, index) {
            if (After.Utilities.GetDistanceBetween(value.LocationID, After.Me.CurrentXYZ) <= After.Me.ViewDistance) {
                After.World_Data.Areas.splice(index, 1);
            }
        })
        JsonMessage.Areas.forEach(function (value) {
            var area = After.Models.Game.Area.Create(value);
            After.World_Data.Areas.push(area);
        })
        After.World_Data.Areas.forEach(function (value) {
            if (After.Utilities.GetDistanceBetween(value.LocationID, After.Me.CurrentXYZ) <= After.Me.ViewDistance) {
                value.Opacity = 1;
            }
            else {
                value.Opacity = .1;
            }
        })
    }
    export function HandleRememberLocations(JsonMessage) {
        // TODO
    }
}