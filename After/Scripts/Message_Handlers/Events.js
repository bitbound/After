var After;
(function (After) {
    var Message_Handlers;
    (function (Message_Handlers) {
        var Events;
        (function (Events) {
            function HandleStartCharging(jsonMessage) {
                $("#buttonCharge").removeAttr("disabled");
                if (jsonMessage.Result == "ok") {
                    After.Me.IsCharging = true;
                    $('#divButtonCharge').hide();
                    $('#divCharge').show();
                    if (After.Temp.ChargeInterval != undefined) {
                        window.clearInterval(After.Temp.ChargeInterval);
                    }
                    After.Temp.ChargeInterval = window.setInterval(function () {
                        if (After.Me.IsCharging == false) {
                            if (After.Me.CurrentCharge == 0) {
                                $('#divButtonCharge').show();
                                $('#divCharge').hide();
                                window.clearInterval(After.Temp.ChargeInterval);
                            }
                            return;
                        }
                        var divRect = document.getElementById("divCharge").getBoundingClientRect();
                        var riseHeight = $("#divCharge").height() * .8;
                        var chargePercent = After.Me.CurrentCharge / After.Me.MaxCharge;
                        var startLeft = After.Utilities.GetRandom($("#divCharge").width() * .15, $("#divCharge").width() * .85, true);
                        var startTop = $("#divCharge").height() * .5;
                        var part = document.createElement("div");
                        part.classList.add("particle");
                        part.classList.add("anim-charge-button");
                        $(part).css({
                            left: startLeft,
                            top: startTop,
                        });
                        $("#divCharge").append(part);
                        window.setTimeout(function () {
                            $(part).remove();
                        }, 1100);
                    }, 100);
                }
                // TODO: Else...
            }
            Events.HandleStartCharging = HandleStartCharging;
            function HandleStopCharging(jsonMessage) {
                $("#buttonCharge").removeAttr("disabled");
                After.Me.IsCharging = false;
            }
            Events.HandleStopCharging = HandleStopCharging;
        })(Events = Message_Handlers.Events || (Message_Handlers.Events = {}));
    })(Message_Handlers = After.Message_Handlers || (After.Message_Handlers = {}));
})(After || (After = {}));
//# sourceMappingURL=Events.js.map