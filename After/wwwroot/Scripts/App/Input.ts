namespace After.App {
    export class Input {
        constructor() {
            this.AdminInputHistory = new Array<string>();
            this.AdminHistoryPosition = -1;
            this.ChatInputHistory = new Array<string>();
            this.ChatHistoryPosition = -1;
        }
        AdminInputHistory: Array<string>;
        AdminHistoryPosition: number;
        ChatInputHistory: Array<string>;
        ChatHistoryPosition: number;
        SendChat(e) {
            var strMessage = $("#inputChatInput").val();
            $("#inputChatInput").val("");
            if (strMessage == "") {
                return;
            }
            this.ChatInputHistory.unshift(strMessage);
            while (this.ChatInputHistory.length > 50) {
                this.ChatInputHistory.pop();
            }
            this.ChatHistoryPosition = -1;
            if (strMessage.trim().toLowerCase() == "/debug" || ($("#selectChatChannel").val() == "Command" && strMessage.trim().toLowerCase() == "debug")) {
                After.Debug = !After.Debug;
                if (After.Debug) {
                    $("#divDebug").show();
                }
                else {
                    $("#divDebug").hide();
                }
                return;
            }
            var jsonMessage = {
                "Category": "Messages",
                "Type": "Chat",
                "Channel": $("#selectChatChannel").val(),
                "Message": strMessage
            };
            After.Connection.Socket.send(JSON.stringify(jsonMessage));
        }
        SendAdmin(e) {
            var strMessage = $("#inputAdminInput").val();
            $("#inputAdminInput").val("");
            if (strMessage == "") {
                return;
            }
            this.AdminInputHistory.unshift(strMessage);
            while (this.AdminInputHistory.length > 50) {
                this.AdminInputHistory.pop();
            }
            this.AdminHistoryPosition = -1;
            if (strMessage.trim().toLowerCase() == "debug") {
                After.Debug = !After.Debug;
                if (After.Debug) {
                    $("#divDebug").show();
                }
                else {
                    $("#divDebug").hide();
                }
                return;
            }
            var jsonMessage = {
                "Category": "Messages",
                "Type": "Admin",
                "Message": strMessage
            };
            After.Connection.Socket.send(JSON.stringify(jsonMessage));
        }
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
        SetInputHandlers() {
            window.onresize = function() {
                After.Canvas.Element.width = document.documentElement.clientWidth;
                After.Canvas.Element.height = document.documentElement.clientHeight;
                window.setTimeout(function() {
                    After.Canvas.Element.width = document.documentElement.clientWidth;
                    After.Canvas.Element.height = document.documentElement.clientHeight;
                }, 500);
            };
            window.onkeypress = function(e) {
                if ($("input").is(":focus") == false) {
                    if (e.key == "6" || e.key == "ArrowRight" || e.key == "d") {
                        After.Me.Move("E");
                    }
                    else if (e.key == "3" || e.key == "PageDown") {
                        After.Me.Move("SE");
                    }
                    else if (e.key == "2" || e.key == "ArrowDown" || e.key == "s") {
                        After.Me.Move("S");
                    }
                    else if (e.key == "1" || e.key == "End") {
                        After.Me.Move("SW");
                    }
                    else if (e.key == "4" || e.key == "ArrowLeft" || e.key == "a") {
                        After.Me.Move("W");
                    }
                    else if (e.key == "7" || e.key == "Home") {
                        After.Me.Move("NW");
                    }
                    else if (e.key == "8" || e.key == "ArrowUp" || e.key == "w") {
                        After.Me.Move("N");
                    }
                    else if (e.key == "9" || e.key == "PageUp") {
                        After.Me.Move("NE");
                    }
                    else if (e.key == "5") {
                        After.Canvas.CenterOnCoords(After.Me.XCoord, After.Me.YCoord, false, true);
                    }
                    else if (e.key == " ") {
                        After.Me.ToggleCharging();
                    }
                }
            };
            After.Canvas.Element.onwheel = function(e) {
                e.preventDefault();
                var scaleChange = 0;
                if (e.deltaY < 0) {
                    scaleChange = 1;
                } else {
                    scaleChange = -1;
                };
                scaleChange = scaleChange * .2 * After.Canvas.ZoomScale;
                if (After.Canvas.ZoomScale + scaleChange < .1) {
                    After.Canvas.ZoomScale = .1;
                    return;
                }
                else if (After.Canvas.ZoomScale + scaleChange > 100) {
                    After.Canvas.ZoomScale = 100;
                    return;
                }
                After.Canvas.ZoomScale += scaleChange;
                After.Canvas.OffsetX -= (scaleChange / After.Canvas.ZoomScale) * (After.Canvas.Element.width * (e.clientX / After.Canvas.Element.width)) / After.Canvas.ZoomScale;
                After.Canvas.OffsetY -= (scaleChange / After.Canvas.ZoomScale) * (After.Canvas.Element.height * (e.clientY / After.Canvas.Element.height)) / After.Canvas.ZoomScale;
            };
            After.Canvas.Element.onclick = function(e) {
                if (After.Canvas.StartDragX == e.clientX && After.Canvas.StartDragY == e.clientY) {
                    After.Canvas.SelectPoint(e);
                }
            };
            After.Canvas.Element.onmousedown = function(e) {
                $("input:focus").blur();
                After.Canvas.StartDragX = e.clientX;
                After.Canvas.StartDragY = e.clientY;
                After.Canvas.StartOffsetX = After.Canvas.OffsetX;
                After.Canvas.StartOffsetY = After.Canvas.OffsetY;
                After.Canvas.IsPanning = true;
                After.Canvas.InertiaX = 0;
                After.Canvas.InertiaY = 0;
                After.Canvas.InertiaStack = new Array();
                e.preventDefault();
            };
            After.Canvas.Element.onmousemove = function(e) {
                if (e.buttons == 1 && After.Canvas.IsPanning) {
                    e.preventDefault();
                    After.Canvas.OffsetX = After.Canvas.StartOffsetX + ((e.clientX - After.Canvas.StartDragX) / After.Canvas.ZoomScale);
                    After.Canvas.OffsetY = After.Canvas.StartOffsetY + ((e.clientY - After.Canvas.StartDragY) / After.Canvas.ZoomScale);
                    After.Canvas.InertiaStack.push({ "Event": e, "Timestamp": (new Date().getTime()) });

                    while (After.Canvas.InertiaStack.length > 5) {
                        After.Canvas.InertiaStack.splice(0, 1);
                    }
                }
            };
            After.Canvas.Element.onmouseup = function(e) {
                if (!After.Canvas.IsPanning) {
                    return;
                }
                After.Canvas.InertiaStack.push({ "Event": e, "Timestamp": (new Date().getTime()) });
                After.Canvas.ApplyInertia();
                e.preventDefault();
            };
            After.Canvas.Element.onmouseleave = function(e) {
                if (After.Canvas.IsPanning) {
                    After.Canvas.InertiaStack.push({ "Event": e, "Timestamp": (new Date().getTime()) });
                    After.Canvas.ApplyInertia();
                }
                After.Canvas.IsPanning = false;
                After.Canvas.IsZooming = false;
            };
            After.Canvas.Element.ontouchstart = function(e) {
                $("input:focus").blur();
                After.Canvas.IsZooming = false;
                After.Canvas.InertiaX = 0;
                After.Canvas.InertiaY = 0;
                After.Canvas.StartDragX = 0;
                After.Canvas.StartDragY = 0;
                After.Canvas.InertiaStack = new Array();
                for (var i = 0; i < e.touches.length; i++) {
                    After.Canvas.StartDragX += e.touches[i].clientX;
                    After.Canvas.StartDragY += e.touches[i].clientY;
                };
                After.Canvas.StartDragX /= e.touches.length;
                After.Canvas.StartDragY /= e.touches.length;

                After.Canvas.StartOffsetX = After.Canvas.OffsetX;
                After.Canvas.StartOffsetY = After.Canvas.OffsetY;
                After.Canvas.IsPanning = true;
                if (e.touches.length == 2) {
                    After.Canvas.IsZooming = true;
                    var higherX = Math.max(e.touches[0].clientX, e.touches[1].clientX);
                    var lowerX = Math.min(e.touches[0].clientX, e.touches[1].clientX);
                    var distanceX = higherX - lowerX;
                    var higherY = Math.max(e.touches[0].clientY, e.touches[1].clientY);
                    var lowerY = Math.min(e.touches[0].clientY, e.touches[1].clientY);
                    var distanceY = higherY - lowerY;
                    After.Canvas.LastTouchDistance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
                    After.Canvas.LastTouchPoint1 = e.touches[0];
                    After.Canvas.LastTouchPoint2 = e.touches[1];
                }
            };
            After.Canvas.Element.ontouchmove = function(e) {
                e.preventDefault();
                if (e.touches.length == 1) {
                    After.Canvas.OffsetX = After.Canvas.StartOffsetX + ((e.touches[0].clientX - After.Canvas.StartDragX) / After.Canvas.ZoomScale);
                    After.Canvas.OffsetY = After.Canvas.StartOffsetY + ((e.touches[0].clientY - After.Canvas.StartDragY) / After.Canvas.ZoomScale);

                    After.Canvas.InertiaStack.push({ "Event": e.touches[0], "Timestamp": (new Date().getTime()) });
                    while (After.Canvas.InertiaStack.length > 5) {
                        After.Canvas.InertiaStack.splice(0, 1);
                    }
                } else if (e.touches.length > 1) {
                    var xCenter = 0;
                    var yCenter = 0;
                    for (var i = 0; i < e.touches.length; i++) {
                        xCenter += e.touches[i].clientX;
                        yCenter += e.touches[i].clientY;
                    };
                    xCenter /= e.touches.length;
                    yCenter /= e.touches.length;
                    var higherX = Math.max(e.touches[0].clientX, e.touches[1].clientX);
                    var lowerX = Math.min(e.touches[0].clientX, e.touches[1].clientX);
                    var distanceX = higherX - lowerX;
                    var higherY = Math.max(e.touches[0].clientY, e.touches[1].clientY);
                    var lowerY = Math.min(e.touches[0].clientY, e.touches[1].clientY);
                    var distanceY = higherY - lowerY;
                    var distanceTotal = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
                    var scaleChange = (distanceTotal - After.Canvas.LastTouchDistance) * .005 * After.Canvas.ZoomScale;
                    var tranPanX = (xCenter - After.Canvas.StartDragX) / After.Canvas.ZoomScale;
                    var tranPanY = (yCenter - After.Canvas.StartDragY) / After.Canvas.ZoomScale;
                    var scalePanX = (scaleChange / After.Canvas.ZoomScale) * (After.Canvas.Element.width * (xCenter / After.Canvas.Element.width)) / After.Canvas.ZoomScale;
                    var scalePanY = (scaleChange / After.Canvas.ZoomScale) * (After.Canvas.Element.height * (yCenter / After.Canvas.Element.height)) / After.Canvas.ZoomScale;

                    After.Canvas.OffsetX = After.Canvas.StartOffsetX + tranPanX;
                    After.Canvas.OffsetY = After.Canvas.StartOffsetY + tranPanY;
                    if (After.Canvas.ZoomScale + scaleChange < .1) {
                        After.Canvas.ZoomScale = .1;
                        return;
                    }
                    else if (After.Canvas.ZoomScale + scaleChange > 100) {
                        After.Canvas.ZoomScale = 100;
                        return;
                    }

                    After.Canvas.ZoomScale += scaleChange;
                    After.Canvas.OffsetX -= scalePanX;
                    After.Canvas.OffsetY -= scalePanY;

                    After.Canvas.StartOffsetX -= scalePanX;
                    After.Canvas.StartOffsetY -= scalePanY;

                    After.Canvas.LastTouchDistance = distanceTotal;
                    After.Canvas.LastTouchPoint1 = e.touches[0];
                    After.Canvas.LastTouchPoint2 = e.touches[1];
                };
            };
            After.Canvas.Element.ontouchend = function(e) {
                if (e.touches.length == 0) {
                    if (After.Canvas.IsZooming) {
                        After.Canvas.IsZooming = false;
                        return;
                    }
                    After.Canvas.ApplyInertia();
                } else if (e.touches.length == 1) {
                    After.Canvas.IsPanning = true;
                    After.Canvas.StartDragX = e.touches[0].clientX;
                    After.Canvas.StartDragY = e.touches[0].clientY;
                    After.Canvas.StartOffsetX = After.Canvas.OffsetX;
                    After.Canvas.StartOffsetY = After.Canvas.OffsetY;
                    After.Canvas.InertiaStack = new Array();
                } else if (e.touches.length == 2) {
                    After.Canvas.IsZooming = true;
                    var higherX = Math.max(e.touches[0].clientX, e.touches[1].clientX);
                    var lowerX = Math.min(e.touches[0].clientX, e.touches[1].clientX);
                    var distanceX = higherX - lowerX;
                    var higherY = Math.max(e.touches[0].clientY, e.touches[1].clientY);
                    var lowerY = Math.min(e.touches[0].clientY, e.touches[1].clientY);
                    var distanceY = higherY - lowerY;
                    After.Canvas.LastTouchDistance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
                    After.Canvas.LastTouchPoint1 = e.touches[0];
                    After.Canvas.LastTouchPoint2 = e.touches[1];
                }
            };
            After.Canvas.Element.oncontextmenu = function(e) {
                return false;
            }


            $("#divChatBottomBar").keypress(function(e) {
                if (e.keyCode == 13) {
                    After.Input.SendChat(e);
                } else if (e.keyCode == 27) {
                    $("input:focus").blur();
                }
                else if (e.keyCode == 38) {
                    if (After.Input.ChatHistoryPosition + 1 < After.Input.ChatInputHistory.length) {
                        After.Input.ChatHistoryPosition++;
                        $("#inputChatInput").val(After.Input.ChatInputHistory[After.Input.ChatHistoryPosition]);
                    }
                    else if (After.Input.ChatInputHistory.length == 1) {
                        $("#inputChatInput").val(After.Input.ChatInputHistory[0]);
                    }
                }
                else if (e.keyCode == 40) {
                    if (After.Input.ChatHistoryPosition > 0) {
                        After.Input.ChatHistoryPosition--;
                        $("#inputChatInput").val(After.Input.ChatInputHistory[After.Input.ChatHistoryPosition]);
                    }
                    else if (After.Input.ChatInputHistory.length == 1) {
                        $("#inputChatInput").val(After.Input.ChatInputHistory[0]);
                    }
                }
            });
            $("#buttonChatSubmit").click(function(e) {
                After.Input.SendChat(e);
            });

            $("#divAdminBottomBar").keypress(function(e) {
                if (e.keyCode == 13) {
                    After.Input.SendAdmin(e);
                } else if (e.keyCode == 27) {
                    $("input:focus").blur();
                }
                else if (e.keyCode == 38) {
                    if (After.Input.AdminHistoryPosition + 1 < After.Input.AdminInputHistory.length) {
                        After.Input.AdminHistoryPosition++;
                        $("#inputAdminInput").val(After.Input.AdminInputHistory[After.Input.AdminHistoryPosition]);
                    }
                    else if (After.Input.AdminInputHistory.length == 1) {
                        $("#inputAdminInput").val(After.Input.AdminInputHistory[0]);
                    }
                }
                else if (e.keyCode == 40) {
                    if (After.Input.AdminHistoryPosition > 0) {
                        After.Input.AdminHistoryPosition--;
                        $("#inputAdminInput").val(After.Input.AdminInputHistory[After.Input.AdminHistoryPosition]);
                    }
                    else if (After.Input.AdminInputHistory.length == 1) {
                        $("#inputAdminInput").val(After.Input.AdminInputHistory[0]);
                    }
                }
            });
            $("#buttonAdminSubmit").click(function(e) {
                After.Input.SendAdmin(e);
            });

            $("#buttonCharge").click(function(e) {
                After.Me.ToggleCharging();
            });
            $("#divCharge").click(function(e) {
                After.Me.ToggleCharging();
            });

            $(".bottom-tab-icon").mousedown(function(e) {
                e.preventDefault();
                if (e.currentTarget.classList.contains("blinking")) {
                    e.currentTarget.classList.remove("blinking");
                }
                After.Temp.Dragging = true;
                After.Temp.StartPoint = e;
                After.Temp.ActiveIcon = $(e.currentTarget);
                After.Temp.ActiveFrame = $(e.currentTarget).parent();
                After.Temp.StartHeight = After.Temp.ActiveFrame.height();
                After.Temp.StartLeft = Number(After.Temp.ActiveFrame.css("left").replace("px", ""));
                $("input:focus").blur();

                window.onmousemove = function(e) {
                    e.preventDefault();
                    if (After.Temp.Dragging) {
                        After.Temp.ActiveFrame.css("z-index", 2);
                        var newHeight = After.Temp.StartHeight - (e.clientY - After.Temp.StartPoint.clientY);
                        if (newHeight > document.body.clientHeight * .6) {
                            After.Temp.ActiveFrame.height(document.body.clientHeight * .6);
                        }
                        else if (newHeight > 0) {
                            After.Temp.ActiveFrame.height(newHeight);
                        }
                        else if (newHeight <= 0) {
                            After.Temp.ActiveFrame.css("z-index", 0);
                            After.Temp.ActiveFrame.height(0);
                        }
                        if (!After.Settings.LockTabs) {
                            var newLeft = After.Temp.StartLeft + e.clientX - After.Temp.StartPoint.clientX;
                            if (newLeft > 10) {
                                if (newLeft < document.body.clientWidth - 60) {
                                    After.Temp.ActiveFrame.css("left", newLeft + "px");
                                }
                            }
                            else {
                                After.Temp.ActiveFrame.css("left", "10px");
                            }
                        }
                    }
                };
                window.onmouseleave = function(e) {
                    After.Temp.Dragging = false;
                    $(window).off("mousemove");
                    $(window).off("mouseleave");
                    $(window).off("mouseup");
                };
                window.onmouseup = function(e) {
                    var totalXDistance = Math.abs(e.clientX - After.Temp.StartPoint.clientX);
                    var totalYDistance = Math.abs(e.clientY - After.Temp.StartPoint.clientY);
                    if (totalXDistance < 5 && totalYDistance < 5) {
                        if (After.Temp.ActiveFrame.height() > 0) {
                            After.Temp.ActiveFrame.css("z-index", 0);
                            After.Temp.ActiveFrame.animate({ "height": "0" }, 750);
                        } else {
                            After.Temp.ActiveFrame.css("z-index", 2);
                            After.Temp.ActiveFrame.animate({ "height": "155" }, 750);
                            $("input:focus").blur();
                        }
                    }
                    After.Temp.Dragging = false;
                    window.onmousemove = null;
                    window.onmouseleave = null;
                    window.onmouseup = null;
                };
            });
            $(".bottom-tab-icon").on("touchstart", function(e: JQueryEventObject & TouchEvent) {
                e.preventDefault();
                if (e.currentTarget.classList.contains("blinking")) {
                    e.currentTarget.classList.remove("blinking");
                }
                if (e.touches.length == 1) {
                    $(e.currentTarget).addClass("hover");
                    After.Temp.Dragging = true;
                    After.Temp.StartPoint = e.touches[0];
                    After.Temp.ActiveIcon = $(e.currentTarget);
                    After.Temp.ActiveFrame = $(e.currentTarget).parent();
                    After.Temp.StartHeight = After.Temp.ActiveFrame.height();
                    After.Temp.StartLeft = Number(After.Temp.ActiveFrame.css("left").replace("px", ""));
                    After.Temp.LastTouch = e.touches[0];

                    window.ontouchmove = function(e) {
                        e.preventDefault();
                        if (After.Temp.Dragging && e.touches.length == 1) {
                            After.Temp.ActiveFrame.css("z-index", 2);
                            After.Temp.LastTouch = e.touches[0];
                            var newHeight = After.Temp.StartHeight - (e.touches[0].clientY - After.Temp.StartPoint.clientY);
                            if (newHeight > document.body.clientHeight * .6) {
                                After.Temp.ActiveFrame.height(document.body.clientHeight * .6);
                                $("input:focus").blur();
                            }
                            else if (newHeight > 0) {
                                After.Temp.ActiveFrame.height(newHeight);
                                $("input:focus").blur();
                            }
                            else if (newHeight <= 0) {
                                After.Temp.ActiveFrame.css("z-index", 0);
                                After.Temp.ActiveFrame.height(0);
                            }
                            if (!After.Settings.LockTabs) {
                                var newLeft = After.Temp.StartLeft + e.touches[0].clientX - After.Temp.StartPoint.clientX;
                                if (newLeft > 10) {
                                    if (newLeft < document.body.clientWidth - 60) {
                                        After.Temp.ActiveFrame.css("left", newLeft + "px");
                                    }
                                }
                                else {
                                    After.Temp.ActiveFrame.css("left", "10px");
                                }
                            }
                        }
                    };
                    window.ontouchend = function(e) {
                        After.Temp.ActiveIcon.removeClass("hover");
                        var totalXDistance = Math.abs(After.Temp.LastTouch.clientX - After.Temp.StartPoint.clientX);
                        var totalYDistance = Math.abs(After.Temp.LastTouch.clientY - After.Temp.StartPoint.clientY);
                        if (totalXDistance < 5 && totalYDistance < 5) {
                            if (After.Temp.StartHeight == 0) {
                                After.Temp.ActiveFrame.css("z-index", 2);
                                After.Temp.ActiveFrame.animate({ "height": "155" }, 750);
                            } else {
                                After.Temp.ActiveFrame.css("z-index", 0);
                                After.Temp.ActiveFrame.animate({ "height": "0" }, 750);
                            }
                        }
                        After.Temp.Dragging = false;
                        window.ontouchmove = null;
                        window.ontouchend = null;
                    };
                }
            });

            $(".side-tab-icon").mousedown(function(e) {
                e.preventDefault();
                if (e.currentTarget.classList.contains("blinking")) {
                    e.currentTarget.classList.remove("blinking");
                }
                After.Temp.Dragging = true;
                After.Temp.StartPoint = e;
                After.Temp.ActiveIcon = $(e.currentTarget);
                After.Temp.ActiveFrame = $(e.currentTarget).parent();
                After.Temp.StartWidth = After.Temp.ActiveFrame.width();

                window.onmousemove = function(e) {
                    e.preventDefault();
                    if (After.Temp.Dragging) {
                        After.Temp.ActiveFrame.css("z-index", 2);
                        var newWidth = After.Temp.StartWidth - (e.clientX - After.Temp.StartPoint.clientX);
                        if (newWidth > document.body.clientWidth * .6) {
                            After.Temp.ActiveFrame.width(document.body.clientWidth * .6);
                        }
                        else if (newWidth > 0) {
                            After.Temp.ActiveFrame.width(newWidth);
                        }
                        else if (newWidth <= 0) {
                            After.Temp.ActiveFrame.css("z-index", 0);
                            After.Temp.ActiveFrame.width(0);
                        }
                    }
                };
                window.onmouseleave = function(e) {
                    After.Temp.Dragging = false;
                    $(window).off("mousemove");
                    $(window).off("mouseleave");
                    $(window).off("mouseup");
                };
                window.onmouseup = function(e) {
                    var totalXDistance = Math.abs(e.clientX - After.Temp.StartPoint.clientX);
                    var totalYDistance = Math.abs(e.clientY - After.Temp.StartPoint.clientY);
                    if (totalXDistance < 5 && totalYDistance < 5) {
                        if (After.Temp.ActiveFrame.width() > 0) {
                            After.Temp.ActiveFrame.css("z-index", 0);
                            After.Temp.ActiveFrame.animate({ "width": "0" }, 750);
                        } else {
                            After.Temp.ActiveFrame.css("z-index", 2);
                            After.Temp.ActiveFrame.animate({ "width": "180" }, 750);
                        }
                    }
                    After.Temp.Dragging = false;
                    window.onmousemove = null;
                    window.onmouseleave = null;
                    window.onmouseup = null;
                };
            });
            $(".side-tab-icon").on("touchstart", function(e: JQueryEventObject & TouchEvent) {
                e.preventDefault();
                if (e.currentTarget.classList.contains("blinking")) {
                    e.currentTarget.classList.remove("blinking");
                }
                if (e.touches.length == 1) {
                    $(e.currentTarget).addClass("hover");
                    After.Temp.Dragging = true;
                    After.Temp.StartPoint = e.touches[0];
                    After.Temp.ActiveIcon = $(e.currentTarget);
                    After.Temp.ActiveFrame = $(e.currentTarget).parent();
                    After.Temp.StartWidth = After.Temp.ActiveFrame.width();
                    After.Temp.LastTouch = e.touches[0];

                    window.ontouchmove = function(e) {
                        e.preventDefault();
                        if (After.Temp.Dragging && e.touches.length == 1) {
                            After.Temp.ActiveFrame.css("z-index", 2);
                            After.Temp.LastTouch = e.touches[0];
                            var newWidth = After.Temp.StartWidth - (e.touches[0].clientX - After.Temp.StartPoint.clientX);
                            if (newWidth > document.body.clientWidth * .6) {
                                After.Temp.ActiveFrame.width(document.body.clientWidth * .6);
                            }
                            else if (newWidth > 0) {
                                After.Temp.ActiveFrame.width(newWidth);
                            }
                            else if (newWidth <= 0) {
                                After.Temp.ActiveFrame.css("z-index", 0);
                                After.Temp.ActiveFrame.width(0);
                            }
                        }
                    };
                    window.ontouchend = function(e) {
                        After.Temp.ActiveIcon.removeClass("hover");
                        var totalXDistance = Math.abs(After.Temp.LastTouch.clientX - After.Temp.StartPoint.clientX);
                        var totalYDistance = Math.abs(After.Temp.LastTouch.clientY - After.Temp.StartPoint.clientY);
                        if (totalXDistance < 5 && totalYDistance < 5) {
                            if (After.Temp.StartWidth == 0) {
                                After.Temp.ActiveFrame.css("z-index", 2);
                                After.Temp.ActiveFrame.animate({ "width": "180" }, 750);
                            } else {
                                After.Temp.ActiveFrame.css("z-index", 0);
                                After.Temp.ActiveFrame.animate({ "width": "0" }, 750);
                            }
                        }
                        After.Temp.Dragging = false;
                        window.ontouchmove = null;
                        window.ontouchend = null;
                    };
                }
            });

            $(".thumb-control").on("mousedown", function(e) {
                e.preventDefault();
                After.Temp.Dragging = true;
                After.Temp.StartPoint = e;
                After.Temp.ActiveIcon = $(e.currentTarget);
                After.Temp.ActiveFrame = $(e.currentTarget).parent();
                After.Temp.StartWidth = After.Temp.ActiveFrame.width();
                After.Temp.StartBottom = Number(After.Temp.ActiveFrame.css("bottom").replace("px", ""));

                window.onmousemove = function(e) {
                    e.preventDefault();
                    if (After.Temp.Dragging) {
                        After.Temp.ActiveFrame.css("z-index", 2);
                        var newWidth = After.Temp.StartWidth + (e.clientX - After.Temp.StartPoint.clientX);
                        if (newWidth > 150) {
                            After.Temp.ActiveFrame.width(150);
                        }
                        else if (newWidth > 0) {
                            After.Temp.ActiveFrame.width(newWidth);
                        }
                        else if (newWidth <= 0) {
                            After.Temp.ActiveFrame.css("z-index", 0);
                            After.Temp.ActiveFrame.width(0);
                        }
                        if (!After.Settings.LockTabs) {
                            var newBottom = After.Temp.StartBottom + After.Temp.StartPoint.clientY - e.clientY;
                            if (newBottom > 85) {
                                if (newBottom < document.body.clientHeight - 85) {
                                    After.Temp.ActiveFrame.css("bottom", newBottom + "px");
                                }
                            }
                            else {
                                After.Temp.ActiveFrame.css("bottom", "85px");
                            }
                        }
                    }
                };
                window.onmouseleave = function(e) {
                    After.Temp.Dragging = false;
                    $(window).off("mousemove");
                    $(window).off("mouseleave");
                    $(window).off("mouseup");
                };
                window.onmouseup = function(e) {
                    var totalXDistance = Math.abs(e.clientX - After.Temp.StartPoint.clientX);
                    var totalYDistance = Math.abs(e.clientY - After.Temp.StartPoint.clientY);
                    if (totalXDistance < 5 && totalYDistance < 5) {
                        if (After.Temp.ActiveFrame.width() > 0) {
                            After.Temp.ActiveFrame.css("z-index", 0);
                            After.Temp.ActiveFrame.animate({ "width": "0" }, 750);
                            After.Temp.ActiveIcon.animate({ "opacity": ".8" }, 750);
                        } else {
                            After.Temp.ActiveFrame.css("z-index", 2);
                            After.Temp.ActiveFrame.animate({ "width": "150" }, 750);
                            After.Temp.ActiveIcon.animate({ "opacity": ".25" }, 750);
                        }
                    }
                    else if (After.Temp.ActiveFrame.width() > 75) {
                        After.Temp.ActiveFrame.animate({ "width": "150" }, 750);
                        After.Temp.ActiveIcon.animate({ "opacity": ".25" }, 750);
                    }
                    else if (After.Temp.ActiveFrame.width() <= 75) {
                        After.Temp.ActiveFrame.animate({ "width": "0" }, 750);
                        After.Temp.ActiveIcon.animate({ "opacity": ".8" }, 750);
                    }
                    After.Temp.Dragging = false;
                    window.onmousemove = null;
                    window.onmouseleave = null;
                    window.onmouseup = null;
                };
            });
            $(".thumb-control").on("touchstart", function(e: JQueryEventObject & TouchEvent) {
                e.preventDefault();
                if (e.touches.length == 1) {
                    $(e.currentTarget).addClass("hover");
                    After.Temp.Dragging = true;
                    After.Temp.StartPoint = e.touches[0];
                    After.Temp.ActiveIcon = $(e.currentTarget);
                    After.Temp.ActiveFrame = $(e.currentTarget).parent();
                    After.Temp.StartWidth = After.Temp.ActiveFrame.width();
                    After.Temp.StartBottom = Number(After.Temp.ActiveFrame.css("bottom").replace("px", ""));
                    After.Temp.LastTouch = e.touches[0];

                    window.ontouchmove = function(e) {
                        e.preventDefault();
                        if (After.Temp.Dragging && e.touches.length == 1) {
                            After.Temp.ActiveFrame.css("z-index", 2);
                            After.Temp.LastTouch = e.touches[0];
                            var newWidth = After.Temp.StartWidth + (e.touches[0].clientX - After.Temp.StartPoint.clientX);
                            if (newWidth > 150) {
                                After.Temp.ActiveFrame.width(150);
                            }
                            else if (newWidth > 0) {
                                After.Temp.ActiveFrame.width(newWidth);
                            }
                            else if (newWidth <= 0) {
                                After.Temp.ActiveFrame.css("z-index", 0);
                                After.Temp.ActiveFrame.width(0);
                            }
                            if (!After.Settings.LockTabs) {
                                var newBottom = After.Temp.StartBottom + After.Temp.StartPoint.clientY - e.touches[0].clientY;
                                if (newBottom > 85) {
                                    if (newBottom < document.body.clientHeight - 85) {
                                        After.Temp.ActiveFrame.css("bottom", newBottom + "px");
                                    }
                                }
                                else {
                                    After.Temp.ActiveFrame.css("bottom", "85px");
                                }
                            }
                        }
                    };
                    window.ontouchend = function(e) {
                        After.Temp.ActiveIcon.removeClass("hover");
                        var totalXDistance = Math.abs(After.Temp.LastTouch.clientX - After.Temp.StartPoint.clientX);
                        var totalYDistance = Math.abs(After.Temp.LastTouch.clientY - After.Temp.StartPoint.clientY);
                        if (totalXDistance < 5 && totalYDistance < 5) {
                            if (After.Temp.StartWidth == 0) {
                                After.Temp.ActiveFrame.css("z-index", 2);
                                After.Temp.ActiveFrame.animate({ "width": "150" }, 750);
                                After.Temp.ActiveIcon.animate({ "opacity": ".25" }, 750);
                            } else {
                                After.Temp.ActiveFrame.css("z-index", 0);
                                After.Temp.ActiveFrame.animate({ "width": "0" }, 750);
                                After.Temp.ActiveIcon.animate({ "opacity": ".8" }, 750);
                            }
                        }
                        else if (After.Temp.ActiveFrame.width() > 75) {
                            After.Temp.ActiveFrame.animate({ "width": "150" }, 750);
                            After.Temp.ActiveIcon.animate({ "opacity": ".25" }, 750);
                        }
                        else if (After.Temp.ActiveFrame.width() <= 75) {
                            After.Temp.ActiveFrame.animate({ "width": "0" }, 750);
                            After.Temp.ActiveIcon.animate({ "opacity": ".8" }, 750);
                        }
                        After.Temp.Dragging = false;
                        window.ontouchmove = null;
                        window.ontouchend = null;
                    };
                }
            });

            $("#svgJoystick").on("touchstart", function(e: JQueryEventObject & TouchEvent) {
                if (e.touches.length == 1) {
                    After.Temp.JoystickManipulation = true;
                    window.ontouchmove = function(e) {
                        if (After.Temp.JoystickManipulation) {
                            var parentBounds = $("#svgJoystick").parent()[0].getBoundingClientRect();
                            var xCenter = parentBounds.left + 75;
                            var yCenter = parentBounds.top + 75;
                            var mLeft = Math.min(parentBounds.width / 2, Number(e.touches[0].clientX - xCenter));
                            var mTop = Math.min(parentBounds.height / 2, Number(e.touches[0].clientY - yCenter));
                            mLeft = Math.max(mLeft, -75);
                            mTop = Math.max(mTop, -75);
                            $("#svgJoystick").css("margin-left", mLeft + "px");
                            $("#svgJoystick").css("margin-top", mTop + "px");
                            if (After.Me.IsMoving) {
                                return;
                            }
                            else if (After.Utilities.NumberIsBetween(mLeft, 50, 75, true) && After.Utilities.NumberIsBetween(mTop, -50, 50, true)) {
                                // Joystick is moved to the right (east).
                                After.Me.Move("E");
                            }
                            else if (After.Utilities.NumberIsBetween(mLeft, 35, 75, true) && After.Utilities.NumberIsBetween(mTop, 35, 75, true)) {
                                // Joystick is moved to the bottom right (southeast).
                                After.Me.Move("SE");
                            }
                            else if (After.Utilities.NumberIsBetween(mLeft, -50, 50, true) && After.Utilities.NumberIsBetween(mTop, 50, 75, true)) {
                                // Joystick is moved to the bottom (south).
                                After.Me.Move("S");
                            }
                            else if (After.Utilities.NumberIsBetween(mLeft, -75, -35, true) && After.Utilities.NumberIsBetween(mTop, 35, 75, true)) {
                                // Joystick is moved to the bottom left (southwest).
                                After.Me.Move("SW");
                            }
                            else if (After.Utilities.NumberIsBetween(mLeft, -75, -50, true) && After.Utilities.NumberIsBetween(mTop, -50, 50, true)) {
                                // Joystick is moved to the left (west).
                                After.Me.Move("W");
                            }
                            else if (After.Utilities.NumberIsBetween(mLeft, -75, -35, true) && After.Utilities.NumberIsBetween(mTop, -75, -35, true)) {
                                // Joystick is moved to the upper left (northwest).
                                After.Me.Move("NW");
                            }
                            else if (After.Utilities.NumberIsBetween(mLeft, -50, 50, true) && After.Utilities.NumberIsBetween(mTop, -75, -50, true)) {
                                // Joystick is moved to the top (north).
                                After.Me.Move("N");
                            }
                            else if (After.Utilities.NumberIsBetween(mLeft, 35, 75, true) && After.Utilities.NumberIsBetween(mTop, -75, -35, true)) {
                                // Joystick is moved to the top right (northeast).
                                After.Me.Move("NE");
                            }
                        }
                    };
                    window.ontouchend = function(e) {
                        After.Temp.JoystickManipulation = false;
                        window.ontouchmove = null;
                        window.ontouchend = null;
                        if ($("#svgJoystick").css("margin-left") == "0px" && $("#svgJoystick").css("margin-top") == "0px") {
                            After.Canvas.CenterOnCoords(After.Me.XCoord, After.Me.YCoord, true, true);
                        }
                        else {
                            $("#svgJoystick").animate({
                                "margin-left": "0",
                                "margin-top": "0",
                            }, 500);
                        }
                    }
                }
            });
            $("#svgJoystick").on("mousedown", function(e) {
                e.preventDefault();
                After.Temp.JoystickManipulation = true;
                window.onmousemove = function(e) {
                    if (After.Temp.JoystickManipulation) {
                        var parentBounds = $("#svgJoystick").parent()[0].getBoundingClientRect();
                        var xCenter = parentBounds.left + 75;
                        var yCenter = parentBounds.top + 75;
                        var mLeft = Math.min(parentBounds.width / 2, Number(e.clientX - xCenter));
                        var mTop = Math.min(parentBounds.height / 2, Number(e.clientY - yCenter));
                        mLeft = Math.max(mLeft, -75);
                        mTop = Math.max(mTop, -75);
                        $("#svgJoystick").css("margin-left", mLeft + "px");
                        $("#svgJoystick").css("margin-top", mTop + "px");
                        if (After.Me.IsMoving) {
                            return;
                        }
                        else if (After.Utilities.NumberIsBetween(mLeft, 50, 75, true) && After.Utilities.NumberIsBetween(mTop, -50, 50, true)) {
                            // Joystick is moved to the right (east).
                            After.Me.Move("E");
                        }
                        else if (After.Utilities.NumberIsBetween(mLeft, 35, 75, true) && After.Utilities.NumberIsBetween(mTop, 35, 75, true)) {
                            // Joystick is moved to the bottom right (southeast).
                            After.Me.Move("SE");
                        }
                        else if (After.Utilities.NumberIsBetween(mLeft, -50, 50, true) && After.Utilities.NumberIsBetween(mTop, 50, 75, true)) {
                            // Joystick is moved to the bottom (south).
                            After.Me.Move("S");
                        }
                        else if (After.Utilities.NumberIsBetween(mLeft, -75, -35, true) && After.Utilities.NumberIsBetween(mTop, 35, 75, true)) {
                            // Joystick is moved to the bottom left (southwest).
                            After.Me.Move("SW");
                        }
                        else if (After.Utilities.NumberIsBetween(mLeft, -75, -50, true) && After.Utilities.NumberIsBetween(mTop, -50, 50, true)) {
                            // Joystick is moved to the left (west).
                            After.Me.Move("W");
                        }
                        else if (After.Utilities.NumberIsBetween(mLeft, -75, -35, true) && After.Utilities.NumberIsBetween(mTop, -75, -35, true)) {
                            // Joystick is moved to the upper left (northwest).
                            After.Me.Move("NW");
                        }
                        else if (After.Utilities.NumberIsBetween(mLeft, -50, 50, true) && After.Utilities.NumberIsBetween(mTop, -75, -50, true)) {
                            // Joystick is moved to the top (north).
                            After.Me.Move("N");
                        }
                        else if (After.Utilities.NumberIsBetween(mLeft, 35, 75, true) && After.Utilities.NumberIsBetween(mTop, -75, -35, true)) {
                            // Joystick is moved to the top right (northeast).
                            After.Me.Move("NE");
                        }
                    }
                };
                window.onmouseup = function(e) {
                    After.Temp.JoystickManipulation = false;
                    window.onmousemove = null;
                    window.onmouseup = null;
                    window.onmouseleave = null;
                    $("#svgJoystick").animate({
                        "margin-left": "0",
                        "margin-top": "0",
                    }, 250);
                }
                window.onmouseleave = function(e) {
                    After.Temp.JoystickManipulation = false;
                    window.onmousemove = null;
                    window.onmouseup = null;
                    window.onmouseleave = null;
                    $("#svgJoystick").animate({
                        "margin-left": 0,
                        "margin-top": 0,
                    }, 500);
                }
            });
            $("#svgJoystick").on("click", function (e) {
                After.Canvas.CenterOnCoords(After.Me.XCoord, After.Me.YCoord, true, true);
            })
            $(".dpad-direction").on("click", function(e) {
                After.Me.Move($(e.currentTarget).attr("move-direction"));
                window.setTimeout(function(e) {
                    $(e.currentTarget).blur();
                }, 200, e)
            });
            $("#circleDPadMiddle").on("click", function(e) {
                After.Canvas.CenterOnCoords(After.Me.XCoord, After.Me.YCoord, true, true);
            })

            $(".switch-outer").on("click", function(e) {
                After.Input.ToggleProperty(e);
            });
            $(".side-tab-item-header").on("click", function(e) {
                $(e.currentTarget).next(".side-tab-item-group").slideToggle();
            })
        };
    }
}