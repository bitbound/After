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
        for (var i = After.World_Data.Areas.length - 1; i >= 0; i--) {
            var value = After.World_Data.Areas[i];
            if (After.Utilities.GetDistanceBetween(value.StorageID, After.Me.CurrentXYZ) <= After.Me.ViewDistance) {
                After.World_Data.Areas.splice(i, 1);
            }
        }
        JsonMessage.Areas.forEach(function (value) {
            After.World_Data.Areas.push(value);
        })
        After.World_Data.Areas.forEach(function (value) {
            if (After.Utilities.GetDistanceBetween(value.StorageID, After.Me.CurrentXYZ) <= After.Me.ViewDistance) {
                value.IsVisible = true;
            }
            else {
                value.IsVisible = false;
            }
        })
    }

    export function HandleGetPowers(JsonMessage) {
        $("#divPowersFrame .tab-innerframe").html("");
        for (var i = 0; i < JsonMessage.Powers.length; i++) {
            After.Me.Powers.push(JsonMessage.Powers[i]);
            After.Game.AddPower(JsonMessage.Powers[i]);
        }
        if (JsonMessage.IsAdmin) {
            $("#divAdminFrame").removeAttr("hidden");
        }
        else {
            $("#divAdminFrame").remove();
        }
    }
    export function HandleFirstLoad(JsonMessage) {
        // Account settings.
        for (var setting in JsonMessage.Settings) {
            After.Settings[setting] = JsonMessage.Settings[setting];
        }
        for (var setting in After.Settings) {
            if (typeof After.Settings[setting] == 'boolean') {
                $('#divSideTabs div[prop="' + setting + '"]').attr("on", After.Settings[setting]);
            }
        }

        // Player update.
        for (var stat in JsonMessage.Player) {
            After.Me[stat] = JsonMessage.Player[stat];
        }
        // Iterate twice for properties that rely on other properties.  Lazy solution.
        for (var stat in JsonMessage.Player) {
            After.Me[stat] = JsonMessage.Player[stat];
        }

        // Get powers.
        $("#divPowersFrame .tab-innerframe").html("");
        for (var i = 0; i < JsonMessage.Powers.length; i++) {
            After.Me.Powers.push(JsonMessage.Powers[i]);
            After.Game.AddPower(JsonMessage.Powers[i]);
        }
        if (JsonMessage.IsAdmin) {
            $("#divAdminFrame").removeAttr("hidden");
        }
        else {
            $("#divAdminFrame").remove();
        }

        // Start drawing.
        window.requestAnimationFrame(After.Drawing.DrawCanvas);
        After.Drawing.AnimateParticles();
        After.Canvas.CenterOnCoords(After.Me.XCoord, After.Me.YCoord, true, false);
        After.Canvas.UpdateMap();
    }
    export function HandleMapUpdate(JsonMessage) {
        if (JsonMessage.Area) {
            var index = After.World_Data.Areas.findIndex((value) => {
                return value.StorageID == JsonMessage.Area.StorageID;
            });
            if (index == -1) {
                JsonMessage.Area.IsVisible = false;
                After.World_Data.Areas.push(JsonMessage.Area);
            }
        }
        if (JsonMessage.Landmark) {
            var index = After.World_Data.Landmarks.findIndex((value) => {
                return value.StorageID == JsonMessage.Landmark.StorageID;
            });
            if (index == -1) {
                After.World_Data.Landmarks.push(JsonMessage.Landmark);
            }
        }
    }
}