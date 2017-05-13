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
                if (JsonMessage.AccountType == 3) {
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
            Queries.HandleFirstLoad = HandleFirstLoad;
            function HandleMapUpdate(JsonMessage) {
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
            Queries.HandleMapUpdate = HandleMapUpdate;
            function HandleGetAreaActions(JsonMessage) {
                var point = After.Temp.ButtonPoint;
                var divActionList = document.createElement("div");
                $(divActionList).css({
                    "position": "fixed",
                    "display": "none",
                    "border": "1px solid lightgray"
                });
                if (point.clientX <= document.documentElement.clientWidth / 2) {
                    divActionList.style.left = point.clientX + "px";
                }
                else {
                    divActionList.style.right = (document.documentElement.clientWidth - point.clientX) + "px";
                }
                if (point.clientY <= document.documentElement.clientHeight / 2) {
                    divActionList.style.top = point.clientY + "px";
                }
                else {
                    divActionList.style.bottom = (document.documentElement.clientHeight - point.clientY) + "px";
                }
                for (var i = 0; i < JsonMessage.Actions.length; i++) {
                    var action = document.createElement("div");
                    $(action).css({
                        "padding": "10px",
                        "background-color": "rgba(255,255,255, .75)",
                        "text-align": "center",
                        "cursor": "pointer",
                        "font-weight": "bold"
                    });
                    action.classList.add("font-sansserif");
                    action.setAttribute("targetxyz", JsonMessage.TargetXYZ);
                    $(action).hover(function (e) {
                        $(e.currentTarget).css("background-color", "white");
                    }, function (e) {
                        $(e.currentTarget).css("background-color", "rgba(255,255,255, .75)");
                    });
                    action.innerHTML = JsonMessage.Actions[i];
                    action.onclick = function (e) {
                        var xyz = e.currentTarget.getAttribute("targetxyz");
                        var action = e.currentTarget.innerHTML;
                        var request = {
                            "Category": "Events",
                            "Type": "DoAreaAction",
                            "TargetXYZ": xyz,
                            "Action": action
                        };
                        After.Connection.Socket.send(JSON.stringify(request));
                        // TODO: Handle this on other end.
                    };
                    divActionList.appendChild(action);
                }
                document.body.appendChild(divActionList);
                $(window).one("click", function () {
                    window.setTimeout(function () {
                        $(divActionList).remove();
                    }, 250);
                });
                $(divActionList).mouseout(function () {
                    window.setTimeout(function () {
                        if ($(divActionList).is(":hover") == false) {
                            $(divActionList).remove();
                        }
                    }, 1000);
                });
                $(divActionList).fadeIn();
            }
            Queries.HandleGetAreaActions = HandleGetAreaActions;
        })(Queries = Message_Handlers.Queries || (Message_Handlers.Queries = {}));
    })(Message_Handlers = After.Message_Handlers || (After.Message_Handlers = {}));
})(After || (After = {}));
