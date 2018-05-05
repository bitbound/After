var After;
(function (After) {
    var App;
    (function (App) {
        class Game {
            constructor() {
            }
            Init() {
                After.Temp = {};
                $("#divLogin").animate({ opacity: 0 }, 1000, function () {
                    $("#divLogin").hide();
                    After.Game.Load();
                });
            }
            ;
            Load() {
                After.Canvas.Element = document.getElementById("canvasMap");
                After.Canvas.Context2D = After.Canvas.Element.getContext("2d");
                After.Canvas.Element.width = document.documentElement.clientWidth;
                After.Canvas.Element.height = document.documentElement.clientHeight;
                $("#divGame").animate({ opacity: 1 }, 1000);
                // TODO: Revamp disconnect so page reload isn't necessary.
                $("#divLogin").remove();
                $("#divIntro").remove();
                $("#divCreateAccount").remove();
                if (After.Debug) {
                    $("#divDebug").show();
                }
                After.Input.SetInputHandlers();
                After.Game.PositionSideTabs();
                var query = {
                    "Category": "Queries",
                    "Type": "FirstLoad"
                };
                After.Connection.Socket.send(JSON.stringify(query));
            }
            AddPower(e) {
                if ($("#divPowersFrame .tab-innerframe #divPowersCategory-" + e.Category).length == 0) {
                    var header = document.createElement("div");
                    header.id = "divPowersCategory-" + e.Category;
                    header.classList.add("side-tab-item-header");
                    header.innerHTML = e.Category;
                    $("#divPowersFrame .tab-innerframe").append(header);
                    var itemGroup = document.createElement("div");
                    itemGroup.classList.add("side-tab-item-group");
                    itemGroup.hidden = true;
                    $("#divPowersFrame .tab-innerframe").append(itemGroup);
                    $("#divPowersFrame .tab-innerframe #divPowersCategory-" + e.Category).click(function (e) {
                        $(e.currentTarget).next(".side-tab-item-group").slideToggle();
                    });
                }
                var item = document.createElement("div");
                item.id = "divPower-" + e.Name;
                item.classList.add("side-tab-power");
                item.title = e.Description;
                item.innerHTML = e.Name;
                $("#divPowersFrame .tab-innerframe #divPowersCategory-" + e.Category).next(".side-tab-item-group").append(item);
            }
            PositionSideTabs() {
                var top = 0;
                $("#divSideTabs").find(".side-tab-icon:visible").each(function (index, elem) {
                    elem.style.top = String(top) + "px";
                    top += 65;
                });
            }
            ;
            UpdateStatsUI() {
                $("#divEnergyAmount").text(After.Me.CurrentEnergy);
                $("#divChargeAmount").text(After.Me.CurrentCharge);
                $("#divWillpowerAmount").text(After.Me.CurrentWillpower);
                $("#svgEnergy").css("width", (After.Me.CurrentEnergy / After.Me.MaxEnergy * 100) + "%");
                $("#svgCharge").css("width", (After.Me.CurrentCharge / After.Me.MaxCharge * 100) + "%");
                $("#svgWillpower").css("width", (After.Me.CurrentWillpower / After.Me.MaxWillpower * 100) + "%");
                // TODO: Percentages to increase/decrease bars.
            }
            ;
        }
        App.Game = Game;
    })(App = After.App || (After.App = {}));
})(After || (After = {}));
