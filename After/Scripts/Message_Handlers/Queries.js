var After;
(function (After) {
    var Message_Handlers;
    (function (Message_Handlers) {
        var Queries;
        (function (Queries) {
            function HandleStatUpdate(JsonMessage) {
                After.Me[JsonMessage.Stat] = JsonMessage.Amount;
            }
            Queries.HandleStatUpdate = HandleStatUpdate;
            function HandlePlayerUpdate(JsonMessage) {
                for (var stat in JsonMessage.Player) {
                    After.Me[stat] = JsonMessage.Player[stat];
                }
            }
            Queries.HandlePlayerUpdate = HandlePlayerUpdate;
            function HandleRefreshView(JsonMessage) {
                JsonMessage.Souls.forEach(function (value) {
                    var index = After.World_Data.Souls.findIndex((soul) => { return soul.Name == value.Name; });
                    if (index == -1) {
                        After.World_Data.Souls.push(value);
                    }
                    else {
                        After.World_Data.Souls[index] = value;
                    }
                });
                for (var i = After.World_Data.Areas.length - 1; i >= 0; i--) {
                    var value = After.World_Data.Areas[i];
                    if (After.Utilities.GetDistanceBetween(value.StorageID, After.Me.CurrentXYZ) <= After.Me.ViewDistance) {
                        After.World_Data.Areas.splice(i, 1);
                    }
                }
                JsonMessage.Areas.forEach(function (value) {
                    After.World_Data.Areas.push(value);
                });
                After.World_Data.Areas.forEach(function (value) {
                    if (After.Utilities.GetDistanceBetween(value.StorageID, After.Me.CurrentXYZ) <= After.Me.ViewDistance) {
                        value.IsVisible = true;
                    }
                    else {
                        value.IsVisible = false;
                    }
                });
            }
            Queries.HandleRefreshView = HandleRefreshView;
            function HandleRememberLocations(JsonMessage) {
                // TODO
            }
            Queries.HandleRememberLocations = HandleRememberLocations;
            function HandleGetPowers(JsonMessage) {
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
            Queries.HandleGetPowers = HandleGetPowers;
            function HandleFirstLoad(JsonMessage) {
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
            }
            Queries.HandleFirstLoad = HandleFirstLoad;
        })(Queries = Message_Handlers.Queries || (Message_Handlers.Queries = {}));
    })(Message_Handlers = After.Message_Handlers || (After.Message_Handlers = {}));
})(After || (After = {}));
