namespace After.Models.App {
    export class Game {
        constructor() {
            
        }
        UpdateStatsUI() {
            $("#divEnergyAmount").text(After.Me.CurrentEnergy);
            $("#divChargeAmount").text(After.Me.CurrentCharge);
            $("#divWillpowerAmount").text(After.Me.CurrentWillpower);
            $("#svgEnergy").css("width", (After.Me.CurrentEnergy / After.Me.MaxEnergy * 100) + "%");
            $("#svgCharge").css("width", (After.Me.CurrentCharge / After.Me.MaxCharge * 100) + "%");
            $("#svgWillpower").css("width", (After.Me.CurrentWillpower / After.Me.MaxWillpower * 100) + "%");
            // TODO: Percentages to increase/decrease bars.
        };
        ToggleProperty(e) {
            var prop = e.currentTarget.getAttribute("prop");
            var request = {
                "Category": "Accounts",
                "Type": "ChangeSetting",
                "Property": prop
            }
            if ($(e.currentTarget).attr("on") == "false") {
                $(e.currentTarget).attr("on", "true");
                request["Value"] = true;
            }
            else {
                $(e.currentTarget).attr("on", "false");
                request["Value"] = false;
            }
            After.Connection.Socket.send(JSON.stringify(request));
            After.Settings[prop] = request["Value"];
        };
        PositionSideTabs() {
            var top = 0;
            $("#divSideTabs").find(".side-tab-icon:visible").each(function (index, elem: HTMLElement) {
                elem.style.top = String(top) + "px";
                top += 65;
            })
        };
        AddChatMessage(Message: string, Color: string) {
            var spanMessage = document.createElement("span");
            spanMessage.style.color = Color;
            spanMessage.innerText = Message;
            $("#divChatMessageWindow").append(spanMessage);
            $("#divChatMessageWindow").append("<br/>");
            var divChat = document.getElementById("divChatMessageWindow");
            if (divChat != null) {
                if ($("#divChatMessageWindow").height() == 0) {
                    $("#divChatIconBorder").addClass("blinking");
                }
                divChat.scrollTop = divChat.scrollHeight;
            }
        };
        SendChat(e) {
            var strMessage = $("#inputChatInput").val();
            if (strMessage == "") {
                return;
            }
            var jsonMessage = {
                "Category": "Messages",
                "Type": "Chat",
                "Channel": $("#selectChatChannel").val(),
                "Message": strMessage
            };
            After.Connection.Socket.send(JSON.stringify(jsonMessage));
            $("#inputChatInput").val("");
        };
    }
}