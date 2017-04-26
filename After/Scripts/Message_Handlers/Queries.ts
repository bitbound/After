namespace After.Message_Handlers.Queries {
    export function HandleStatUpdate(jsonMessage) {
        After.Me[jsonMessage.Stat] = jsonMessage.Amount;
        After.Game.UpdateStatsUI();
    }
    export function HandlePlayerUpdate(jsonMessage) {
        for (var stat in jsonMessage.Player) {
            After.Me[stat] = jsonMessage.Player[stat];
        }
        After.Game.UpdateStatsUI();
    }
    export function HandleFirstLoad(jsonMessage) {
        for (var stat in jsonMessage.Player) {
            After.Me[stat] = jsonMessage.Player[stat];
        }
        Drawing.AnimateParticles();
        jsonMessage.Souls.forEach(function (value, index) {
            var soul = After.Models.Game.Soul.Create(value);
            After.World_Data.Souls.push(soul);
        })
        jsonMessage.Areas.forEach(function(value, index) {
            var area = After.Models.Game.Area.Create(value);
            After.World_Data.Areas.push(area);
        })
        After.Game.UpdateStatsUI();
        After.Canvas.CenterOnCoords(After.Me.XCoord, After.Me.YCoord, true, false)
    }
}