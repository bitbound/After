namespace After.Message_Handlers.Queries {
    export function HandleStatUpdate(JsonMessage) {
        After.Me[JsonMessage.Stat] = JsonMessage.Amount;
    }
    export function HandlePlayerUpdate(JsonMessage) {
        for (var stat in JsonMessage.Player) {
            After.Me[stat] = JsonMessage.Player[stat];
        }
    }
    export function HandleRefreshView(JsonMessage) {
        JsonMessage.Souls.forEach(function (value) {
            var index = After.World_Data.Souls.findIndex((soul) => { return soul.Name == value.Name; });
            if (index == -1)
            {
                After.World_Data.Souls.push(value);
            }
            else
            {
                After.World_Data.Souls[index] = value;
            }
        })
        After.World_Data.Areas.forEach(function (value, index) {
            if (After.Utilities.GetDistanceBetween(value.LocationID, After.Me.CurrentXYZ) <= After.Me.ViewDistance) {
                After.World_Data.Areas.splice(index, 1);
            }
        })
        JsonMessage.Areas.forEach(function (value) {
            After.World_Data.Areas.push(value);
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
    export function HandleGetPowers(JsonMessage) {
        $("#divPowersFrame .tab-innerframe").html("");
        for (var i = 0; i < JsonMessage.Powers.length; i++) {
            After.Me.Powers.push(JsonMessage.Powers[i]);
            After.Game.AddPower(JsonMessage.Powers[i]);
        }
    }
}