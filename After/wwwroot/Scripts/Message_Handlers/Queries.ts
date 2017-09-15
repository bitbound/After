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
            var index = After.Storage.Souls.findIndex((soul) => { return soul.Name == value.Name; });
            if (index == -1)
            {
                After.Storage.Souls.push(value);
            }
            else
            {
                After.Storage.Souls[index] = value;
            }
        })
        for (var i = After.Storage.Areas.length - 1; i >= 0; i--) {
            var value = After.Storage.Areas[i];
            if (After.Utilities.GetDistanceBetween(value.StorageID, After.Me.CurrentXYZ) <= After.Me.ViewDistance) {
                After.Storage.Areas.splice(i, 1);
            }
        }
        JsonMessage.Areas.forEach(function (value) {
            After.Storage.Areas.push(value);
        })
        After.Storage.Areas.forEach(function (value) {
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
        After.Canvas.UpdateMap(true);
    }
    export function HandleMapUpdate(JsonMessage) {
        if (JsonMessage.Area) {
            var index = After.Storage.Areas.findIndex((value) => {
                return value.StorageID == JsonMessage.Area.StorageID;
            });
            if (index == -1) {
                JsonMessage.Area.IsVisible = false;
                After.Storage.Areas.push(JsonMessage.Area);
            }
        }
        if (JsonMessage.Landmark) {
            var index = After.Storage.Landmarks.findIndex((value) => {
                return value.StorageID == JsonMessage.Landmark.StorageID;
            });
            if (index == -1) {
                After.Storage.Landmarks.push(JsonMessage.Landmark);
            }
        }
        if (JsonMessage.Completed) {
            After.Temp.MapUpdatePending = false;
        }
    }
    export function HandleGetAreaActions(JsonMessage) {
        var point = (After.Temp.ButtonPoint as MouseEvent | Touch);
        var divActionList = document.createElement("div");
        $(divActionList).css({
            "position": "fixed",
            "display": "none",
            "border": "1px solid lightgray"
        })
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
                "font-weight": "bold",
                "user-select": "none"
            })
            action.classList.add("font-sansserif");
            action.setAttribute("targetxyz", JsonMessage.TargetXYZ);
            $(action).hover(function (e) {
                $(e.currentTarget).css("background-color", "white");
            }, function (e) {
                $(e.currentTarget).css("background-color", "rgba(255,255,255, .75)");
            })
            action.innerHTML = JsonMessage.Actions[i];
            action.onclick = function (e) {
                var xyz = (e.currentTarget as HTMLDivElement).getAttribute("targetxyz");
                var action = (e.currentTarget as HTMLDivElement).innerHTML;
                var request = {
                    "Category": "Events",
                    "Type": "DoAreaAction",
                    "TargetXYZ": xyz,
                    "Action": action
                }
                After.Connection.Socket.send(JSON.stringify(request));
                // TODO: Handle this on other end.
            }
            divActionList.appendChild(action);
        }
        document.body.appendChild(divActionList);
        $(window).one("click", function () {
            window.setTimeout(function () {
                $(divActionList).remove();
            }, 250);
        });
        $(window).one("touchstart", function () {
            window.setTimeout(function () {
                $(divActionList).remove();
            }, 250);
        });
        $(divActionList).mouseout(function () {
            window.setTimeout(function () {
                if ($(divActionList).is(":hover") == false) {
                    $(divActionList).remove();
                }
            }, 1000)
        })
        $(divActionList).fadeIn();
        
    }
    export function HandleGetAreaOccupants(JsonMessage) {
        var point = (After.Temp.ButtonPoint as MouseEvent | Touch);
        var divOccupantList = document.createElement("div");
        $(divOccupantList).css({
            "position": "fixed",
            "display": "none",
            "border": "1px solid lightgray"
        })
        if (point.clientX <= document.documentElement.clientWidth / 2) {
            divOccupantList.style.left = point.clientX + "px";
        }
        else {
            divOccupantList.style.right = (document.documentElement.clientWidth - point.clientX) + "px";
        }
        if (point.clientY <= document.documentElement.clientHeight / 2) {
            divOccupantList.style.top = point.clientY + "px";
        }
        else {
            divOccupantList.style.bottom = (document.documentElement.clientHeight - point.clientY) + "px";
        }
        for (var i = 0; i < JsonMessage.Occupants.length; i++) {
            var occupant = document.createElement("div");
            $(occupant).css({
                "padding": "10px",
                "background-color": "rgba(255,255,255, .75)",
                "text-align": "center",
                "cursor": "pointer",
                "font-weight": "bold",
                "user-select": "none"
            })
            occupant.classList.add("font-sansserif");
            occupant.setAttribute("targetxyz", JsonMessage.TargetXYZ);
            $(occupant).hover(function (e) {
                $(e.currentTarget).css("background-color", "white");
            }, function (e) {
                $(e.currentTarget).css("background-color", "rgba(255,255,255, .75)");
            })
            occupant.innerHTML = JsonMessage.Occupants[i];
            occupant.onclick = function (e) {
                var xyz = (e.currentTarget as HTMLDivElement).getAttribute("targetxyz");
                var occupantName = (e.currentTarget as HTMLDivElement).innerHTML;
                var request = {
                    "Category": "Events",
                    "Type": "AreaOccupantClicked",
                    "TargetXYZ": xyz,
                    "Occupant": occupantName
                }
                After.Connection.Socket.send(JSON.stringify(request));
                // TODO: Handle this on other end.
            }
            divOccupantList.appendChild(occupant);
        }
        document.body.appendChild(divOccupantList);
        $(window).one("click", function () {
            window.setTimeout(function () {
                $(divOccupantList).remove();
            }, 250);
        });
        $(window).one("touchstart", function () {
            window.setTimeout(function () {
                $(divOccupantList).remove();
            }, 250);
        });
        $(divOccupantList).mouseout(function () {
            window.setTimeout(function () {
                if ($(divOccupantList).is(":hover") == false) {
                    $(divOccupantList).remove();
                }
            }, 1000)
        })
        $(divOccupantList).fadeIn();

    }
}