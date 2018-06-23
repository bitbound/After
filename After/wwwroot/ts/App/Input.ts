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
            var strMessage = $("#inputChatInput").val() as string;
            $("#inputChatInput").val("");
            if (strMessage == "") {
                return;
            }
            this.ChatInputHistory.unshift(strMessage);
            while (this.ChatInputHistory.length > 50) {
                this.ChatInputHistory.pop();
            }
            this.ChatHistoryPosition = -1;
            var jsonMessage = {
                "Category": "Messages",
                "Type": "Chat",
                "Channel": $("#selectChatChannel").val(),
                "Message": strMessage
            };
            After.Connection.Socket.send(JSON.stringify(jsonMessage));
        }
        SendAdmin(e) {
            var strMessage = $("#inputAdminInput").val() as string;
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
                "Type": "AdminScript",
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
            window.onkeypress = function(e) {
                if ($("input").is(":focus") == false) {
                    if (e.key == " ") {
                        After.Me.ToggleCharging();
                    }
                }
            };


            $("#divChatBottomBar").keydown(function(e) {
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

            $("#divAdminBottomBar").keydown(function(e) {
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
                    //    if (!After.Settings.LockTabs) {
                    //        var newLeft = After.Temp.StartLeft + e.clientX - After.Temp.StartPoint.clientX;
                    //        if (newLeft > 10) {
                    //            if (newLeft < document.body.clientWidth - 60) {
                    //                After.Temp.ActiveFrame.css("left", newLeft + "px");
                    //            }
                    //        }
                    //        else {
                    //            After.Temp.ActiveFrame.css("left", "10px");
                    //        }
                    //    }
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
                            //if (!After.Settings.LockTabs) {
                            //    var newLeft = After.Temp.StartLeft + e.touches[0].clientX - After.Temp.StartPoint.clientX;
                            //    if (newLeft > 10) {
                            //        if (newLeft < document.body.clientWidth - 60) {
                            //            After.Temp.ActiveFrame.css("left", newLeft + "px");
                            //        }
                            //    }
                            //    else {
                            //        After.Temp.ActiveFrame.css("left", "10px");
                            //    }
                            //}
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
                        //if (!After.Settings.LockTabs) {
                        //    var newBottom = After.Temp.StartBottom + After.Temp.StartPoint.clientY - e.clientY;
                        //    if (newBottom > 85) {
                        //        if (newBottom < document.body.clientHeight - 85) {
                        //            After.Temp.ActiveFrame.css("bottom", newBottom + "px");
                        //        }
                        //    }
                        //    else {
                        //        After.Temp.ActiveFrame.css("bottom", "85px");
                        //    }
                        //}
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
                            //if (!After.Settings.LockTabs) {
                            //    var newBottom = After.Temp.StartBottom + After.Temp.StartPoint.clientY - e.touches[0].clientY;
                            //    if (newBottom > 85) {
                            //        if (newBottom < document.body.clientHeight - 85) {
                            //            After.Temp.ActiveFrame.css("bottom", newBottom + "px");
                            //        }
                            //    }
                            //    else {
                            //        After.Temp.ActiveFrame.css("bottom", "85px");
                            //    }
                            //}
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

            $(".switch-outer").on("click", function(e) {
                After.Input.ToggleProperty(e);
            });
            $(".side-tab-item-header").on("click", function(e) {
                $(e.currentTarget).next(".side-tab-item-group").slideToggle();
            })
        };
    }
}