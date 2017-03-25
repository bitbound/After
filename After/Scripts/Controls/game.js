var After;
(function (After) {
    var Controls;
    (function (Controls) {
        Controls.Game = {
            Init: function () {
                $("#divLogin").animate({ opacity: 0 }, 1000, function () {
                    $("#divLogin").hide();
                    $.get("/Controls/Game.html", function (data) {
                        $(document.body).append(data);
                        var spanMessage = document.createElement("span");
                        spanMessage.style.color = "whitesmoke";
                        spanMessage.innerText = "Welcome to After!";
                        $("#divChatMessageWindow").append(spanMessage);
                        $("#divChatMessageWindow").append("<br/>");
                        After.Controls.Game.Load();
                    });
                });
            },
            Load: function () {
                $("#viewport").attr("content", "width=device-width, user-scalable=no, initiale-scale=0.75, maximum-scale=0.75");
                // TODO: First load.
                var query = {
                    "Category": "Queries",
                    "Type": "FirstLoad"
                };
                After.Connection.Socket.send(JSON.stringify(query));
                After.Canvas.Element = document.getElementById("canvasMap");
                After.Canvas.Context2D = After.Canvas.Element.getContext("2d"),
                    After.Canvas.Element.width = document.documentElement.clientWidth;
                After.Canvas.Element.height = document.documentElement.clientHeight;
                $("#divGame").animate({ opacity: 1 }, 1000);
                delete After.Temp.Intro;
                delete After.Temp.Login;
                $("#divLogin").remove();
                $("#divIntro").remove();
                $("#divCreateAccount").remove();
                if (After.Debug) {
                    $("#divFPS").show();
                }
                window.requestAnimationFrame(After.Drawing.DrawCanvas);
                window.onresize = function () {
                    After.Canvas.Element.width = document.documentElement.clientWidth;
                    After.Canvas.Element.height = document.documentElement.clientHeight;
                    window.setTimeout(function () {
                        After.Canvas.Element.width = document.documentElement.clientWidth;
                        After.Canvas.Element.height = document.documentElement.clientHeight;
                    }, 500);
                };
                window.onkeypress = function (e) {
                    if ($("#inputChatInput").is(":focus") == false) {
                        if (e.key == "6" || e.key == "ArrowRight") {
                            After.Me.Move("E");
                        }
                        else if (e.key == "3" || e.key == "PageDown") {
                            After.Me.Move("SE");
                        }
                        else if (e.key == "2" || e.key == "ArrowDown") {
                            After.Me.Move("S");
                        }
                        else if (e.key == "1" || e.key == "End") {
                            After.Me.Move("SW");
                        }
                        else if (e.key == "4" || e.key == "ArrowLeft") {
                            After.Me.Move("W");
                        }
                        else if (e.key == "7" || e.key == "Home") {
                            After.Me.Move("NW");
                        }
                        else if (e.key == "8" || e.key == "ArrowUp") {
                            After.Me.Move("N");
                        }
                        else if (e.key == "9" || e.key == "PageUp") {
                            After.Me.Move("NE");
                        }
                    }
                };
                After.Canvas.Element.onwheel = function (e) {
                    var scaleChange = 0;
                    if (e.deltaY < 0) {
                        scaleChange = 1;
                    }
                    else {
                        scaleChange = -1;
                    }
                    ;
                    scaleChange = scaleChange * .1 * After.Canvas.Scale;
                    After.Canvas.Scale += scaleChange;
                    After.Canvas.OffsetX -= (scaleChange / After.Canvas.Scale) * (After.Canvas.Element.width * (e.clientX / After.Canvas.Element.width)) / After.Canvas.Scale;
                    After.Canvas.OffsetY -= (scaleChange / After.Canvas.Scale) * (After.Canvas.Element.height * (e.clientY / After.Canvas.Element.height)) / After.Canvas.Scale;
                    e.preventDefault();
                };
                After.Canvas.Element.onclick = function (e) {
                    if (After.Canvas.StartDragX == e.clientX && After.Canvas.StartDragY == e.clientY) {
                        After.Canvas.SelectPoint(e);
                    }
                };
                After.Canvas.Element.onmousedown = function (e) {
                    $("#inputChatInput").blur();
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
                After.Canvas.Element.onmousemove = function (e) {
                    if (e.buttons == 1 && After.Canvas.IsPanning) {
                        After.Canvas.OffsetX = After.Canvas.StartOffsetX + ((e.clientX - After.Canvas.StartDragX) / After.Canvas.Scale);
                        After.Canvas.OffsetY = After.Canvas.StartOffsetY + ((e.clientY - After.Canvas.StartDragY) / After.Canvas.Scale);
                        After.Canvas.InertiaStack.push({ "Event": e, "Timestamp": (new Date().getTime()) });
                        while (After.Canvas.InertiaStack.length > 5) {
                            After.Canvas.InertiaStack.splice(0, 1);
                        }
                        e.preventDefault();
                    }
                };
                After.Canvas.Element.onmouseup = function (e) {
                    if (!After.Canvas.IsPanning) {
                        return;
                    }
                    After.Canvas.InertiaStack.push({ "Event": e, "Timestamp": (new Date().getTime()) });
                    After.Canvas.ApplyInertia();
                    e.preventDefault();
                };
                After.Canvas.Element.onmouseleave = function (e) {
                    After.Canvas.IsPanning = false;
                    After.Canvas.IsZooming = false;
                };
                After.Canvas.Element.ontouchstart = function (e) {
                    $("#inputChatInput").blur();
                    After.Canvas.IsZooming = false;
                    After.Canvas.InertiaX = 0;
                    After.Canvas.InertiaY = 0;
                    After.Canvas.StartDragX = 0;
                    After.Canvas.StartDragY = 0;
                    After.Canvas.InertiaStack = new Array();
                    for (var i = 0; i < e.touches.length; i++) {
                        After.Canvas.StartDragX += e.touches[i].clientX;
                        After.Canvas.StartDragY += e.touches[i].clientY;
                    }
                    ;
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
                    e.preventDefault();
                };
                After.Canvas.Element.ontouchmove = function (e) {
                    if (e.touches.length == 1) {
                        After.Canvas.OffsetX = After.Canvas.StartOffsetX + ((e.touches[0].clientX - After.Canvas.StartDragX) / After.Canvas.Scale);
                        After.Canvas.OffsetY = After.Canvas.StartOffsetY + ((e.touches[0].clientY - After.Canvas.StartDragY) / After.Canvas.Scale);
                        After.Canvas.InertiaStack.push({ "Event": e.touches[0], "Timestamp": (new Date().getTime()) });
                        while (After.Canvas.InertiaStack.length > 5) {
                            After.Canvas.InertiaStack.splice(0, 1);
                        }
                    }
                    else if (e.touches.length > 1) {
                        var xCenter = 0;
                        var yCenter = 0;
                        for (var i = 0; i < e.touches.length; i++) {
                            xCenter += e.touches[i].clientX;
                            yCenter += e.touches[i].clientY;
                        }
                        ;
                        xCenter /= e.touches.length;
                        yCenter /= e.touches.length;
                        var higherX = Math.max(e.touches[0].clientX, e.touches[1].clientX);
                        var lowerX = Math.min(e.touches[0].clientX, e.touches[1].clientX);
                        var distanceX = higherX - lowerX;
                        var higherY = Math.max(e.touches[0].clientY, e.touches[1].clientY);
                        var lowerY = Math.min(e.touches[0].clientY, e.touches[1].clientY);
                        var distanceY = higherY - lowerY;
                        var distanceTotal = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
                        var scaleChange = (distanceTotal - After.Canvas.LastTouchDistance) * .0025 * After.Canvas.Scale;
                        var tranPanX = (xCenter - After.Canvas.StartDragX) / After.Canvas.Scale;
                        var tranPanY = (yCenter - After.Canvas.StartDragY) / After.Canvas.Scale;
                        var scalePanX = (scaleChange / After.Canvas.Scale) * (After.Canvas.Element.width * (xCenter / After.Canvas.Element.width)) / After.Canvas.Scale;
                        var scalePanY = (scaleChange / After.Canvas.Scale) * (After.Canvas.Element.height * (yCenter / After.Canvas.Element.height)) / After.Canvas.Scale;
                        After.Canvas.OffsetX = After.Canvas.StartOffsetX + tranPanX;
                        After.Canvas.OffsetY = After.Canvas.StartOffsetY + tranPanY;
                        After.Canvas.Scale += scaleChange;
                        After.Canvas.OffsetX -= scalePanX;
                        After.Canvas.OffsetY -= scalePanY;
                        After.Canvas.StartOffsetX -= scalePanX;
                        After.Canvas.StartOffsetY -= scalePanY;
                        After.Canvas.LastTouchDistance = distanceTotal;
                        After.Canvas.LastTouchPoint1 = e.touches[0];
                        After.Canvas.LastTouchPoint2 = e.touches[1];
                    }
                    ;
                    e.preventDefault();
                };
                After.Canvas.Element.ontouchend = function (e) {
                    if (e.touches.length == 0) {
                        if (After.Canvas.IsZooming) {
                            After.Canvas.IsZooming = false;
                            return;
                        }
                        if (After.Canvas.StartDragX == e.changedTouches[0].clientX && After.Canvas.StartDragY == e.changedTouches[0].clientY) {
                            After.Canvas.SelectPoint(e.changedTouches[0]);
                            return;
                        }
                        After.Canvas.ApplyInertia();
                    }
                    else if (e.touches.length == 1) {
                        After.Canvas.IsPanning = true;
                        After.Canvas.StartDragX = e.touches[0].clientX;
                        After.Canvas.StartDragY = e.touches[0].clientY;
                        After.Canvas.StartOffsetX = After.Canvas.OffsetX;
                        After.Canvas.StartOffsetY = After.Canvas.OffsetY;
                        After.Canvas.InertiaStack = new Array();
                    }
                    else if (e.touches.length == 2) {
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
                    e.preventDefault();
                };
                $("#divChatInput").keypress(function (e) {
                    if (e.keyCode == 13) {
                        After.Connection.SendChat(e);
                    }
                    else if (e.keyCode == 27) {
                        $("#divChatInput").blur();
                    }
                    ;
                });
                $("#buttonChatSubmit").click(function (e) {
                    After.Connection.SendChat(e);
                });
                $("#buttonCharge").click(function (e) {
                    $("#buttonCharge").attr("disabled", "true");
                    After.Me.ToggleCharging();
                });
                $("#divCharge").click(function (e) {
                    After.Me.ToggleCharging();
                });
                $(".bottom-tab-icon").mousedown(function (e) {
                    e.preventDefault();
                    After.Temp.Dragging = true;
                    After.Temp.StartPoint = e;
                    After.Temp.ActiveIcon = $(e.currentTarget);
                    After.Temp.ActiveFrame = $(e.currentTarget).parent();
                    After.Temp.StartHeight = After.Temp.ActiveFrame.height();
                    $("#inputChatInput").blur();
                    window.onmousemove = function (e) {
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
                        }
                    };
                    window.onmouseleave = function (e) {
                        After.Temp.Dragging = false;
                        $(window).off("mousemove");
                        $(window).off("mouseleave");
                        $(window).off("mouseup");
                    };
                    window.onmouseup = function (e) {
                        var totalXDistance = Math.abs(e.clientX - After.Temp.StartPoint.clientX);
                        var totalYDistance = Math.abs(e.clientY - After.Temp.StartPoint.clientY);
                        if (totalXDistance < 5 && totalYDistance < 5) {
                            if (After.Temp.ActiveFrame.height() > 0) {
                                After.Temp.ActiveFrame.css("z-index", 0);
                                After.Temp.ActiveFrame.animate({ "height": "0" }, 750);
                            }
                            else {
                                After.Temp.ActiveFrame.css("z-index", 2);
                                After.Temp.ActiveFrame.animate({ "height": "155" }, 750);
                                $("#inputChatInput").blur();
                            }
                        }
                        After.Temp.Dragging = false;
                        window.onmousemove = null;
                        window.onmouseleave = null;
                        window.onmouseup = null;
                    };
                });
                $(".bottom-tab-icon").on("touchstart", function (e) {
                    e.preventDefault();
                    if (e.touches.length == 1) {
                        $(e.currentTarget).addClass("hover");
                        After.Temp.Dragging = true;
                        After.Temp.StartPoint = e.touches[0];
                        After.Temp.ActiveIcon = $(e.currentTarget);
                        After.Temp.ActiveFrame = $(e.currentTarget).parent();
                        After.Temp.StartHeight = After.Temp.ActiveFrame.height();
                        After.Temp.LastTouch = e.touches[0];
                        window.ontouchmove = function (e) {
                            e.preventDefault();
                            if (After.Temp.Dragging && e.touches.length == 1) {
                                After.Temp.ActiveFrame.css("z-index", 2);
                                After.Temp.LastTouch = e.touches[0];
                                var newHeight = After.Temp.StartHeight - (e.touches[0].clientY - After.Temp.StartPoint.clientY);
                                if (newHeight > document.body.clientHeight * .6) {
                                    After.Temp.ActiveFrame.height(document.body.clientHeight * .6);
                                    $("#inputChatInput").blur();
                                }
                                else if (newHeight > 0) {
                                    After.Temp.ActiveFrame.height(newHeight);
                                    $("#inputChatInput").blur();
                                }
                                else if (newHeight <= 0) {
                                    After.Temp.ActiveFrame.css("z-index", 0);
                                    After.Temp.ActiveFrame.height(0);
                                }
                            }
                        };
                        window.ontouchend = function (e) {
                            After.Temp.ActiveIcon.removeClass("hover");
                            var totalXDistance = Math.abs(After.Temp.LastTouch.clientX - After.Temp.StartPoint.clientX);
                            var totalYDistance = Math.abs(After.Temp.LastTouch.clientY - After.Temp.StartPoint.clientY);
                            if (totalXDistance < 5 && totalYDistance < 5) {
                                if (After.Temp.ActiveFrame.height() > 0) {
                                    After.Temp.ActiveFrame.css("z-index", 0);
                                    After.Temp.ActiveFrame.animate({ "height": "0" }, 750);
                                }
                                else {
                                    After.Temp.ActiveFrame.css("z-index", 2);
                                    After.Temp.ActiveFrame.animate({ "height": "155" }, 750);
                                }
                            }
                            After.Temp.Dragging = false;
                            window.ontouchmove = null;
                            window.ontouchend = null;
                        };
                    }
                });
                $(".side-tab-icon").mousedown(function (e) {
                    e.preventDefault();
                    After.Temp.Dragging = true;
                    After.Temp.StartPoint = e;
                    After.Temp.ActiveIcon = $(e.currentTarget);
                    After.Temp.ActiveFrame = $(e.currentTarget).parent();
                    After.Temp.StartWidth = After.Temp.ActiveFrame.width();
                    window.onmousemove = function (e) {
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
                    window.onmouseleave = function (e) {
                        After.Temp.Dragging = false;
                        $(window).off("mousemove");
                        $(window).off("mouseleave");
                        $(window).off("mouseup");
                    };
                    window.onmouseup = function (e) {
                        var totalXDistance = Math.abs(e.clientX - After.Temp.StartPoint.clientX);
                        var totalYDistance = Math.abs(e.clientY - After.Temp.StartPoint.clientY);
                        if (totalXDistance < 5 && totalYDistance < 5) {
                            if (After.Temp.ActiveFrame.width() > 0) {
                                After.Temp.ActiveFrame.css("z-index", 0);
                                After.Temp.ActiveFrame.animate({ "width": "0" }, 750);
                            }
                            else {
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
                $(".side-tab-icon").on("touchstart", function (e) {
                    e.preventDefault();
                    if (e.touches.length == 1) {
                        $(e.currentTarget).addClass("hover");
                        After.Temp.Dragging = true;
                        After.Temp.StartPoint = e.touches[0];
                        After.Temp.ActiveIcon = $(e.currentTarget);
                        After.Temp.ActiveFrame = $(e.currentTarget).parent();
                        After.Temp.StartWidth = After.Temp.ActiveFrame.width();
                        After.Temp.LastTouch = e.touches[0];
                        window.ontouchmove = function (e) {
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
                        window.ontouchend = function (e) {
                            After.Temp.ActiveIcon.removeClass("hover");
                            var totalXDistance = Math.abs(After.Temp.LastTouch.clientX - After.Temp.StartPoint.clientX);
                            var totalYDistance = Math.abs(After.Temp.LastTouch.clientY - After.Temp.StartPoint.clientY);
                            if (totalXDistance < 5 && totalYDistance < 5) {
                                if (After.Temp.ActiveFrame.width() > 0) {
                                    After.Temp.ActiveFrame.css("z-index", 0);
                                    After.Temp.ActiveFrame.animate({ "width": "0" }, 750);
                                }
                                else {
                                    After.Temp.ActiveFrame.css("z-index", 2);
                                    After.Temp.ActiveFrame.animate({ "width": "180" }, 750);
                                }
                            }
                            After.Temp.Dragging = false;
                            window.ontouchmove = null;
                            window.ontouchend = null;
                        };
                    }
                });
                $("#divActionButton").on("touchstart", function (e) {
                    e.preventDefault();
                    $(e.currentTarget).addClass("hover");
                });
                $("#divActionButton").on("touchend", function (e) {
                    e.preventDefault();
                    $(e.currentTarget).removeClass("hover");
                });
                $(".thumb-control").on("mousedown", function (e) {
                    e.preventDefault();
                    After.Temp.Dragging = true;
                    After.Temp.StartPoint = e;
                    After.Temp.ActiveIcon = $(e.currentTarget);
                    After.Temp.ActiveFrame = $(e.currentTarget).parent();
                    After.Temp.StartWidth = After.Temp.ActiveFrame.width();
                    window.onmousemove = function (e) {
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
                        }
                    };
                    window.onmouseleave = function (e) {
                        After.Temp.Dragging = false;
                        $(window).off("mousemove");
                        $(window).off("mouseleave");
                        $(window).off("mouseup");
                    };
                    window.onmouseup = function (e) {
                        var totalXDistance = Math.abs(e.clientX - After.Temp.StartPoint.clientX);
                        var totalYDistance = Math.abs(e.clientY - After.Temp.StartPoint.clientY);
                        if (totalXDistance < 5 && totalYDistance < 5) {
                            if (After.Temp.ActiveFrame.width() > 0) {
                                After.Temp.ActiveFrame.css("z-index", 0);
                                After.Temp.ActiveFrame.animate({ "width": "0" }, 750);
                                After.Temp.ActiveIcon.animate({ "opacity": ".8" }, 750);
                            }
                            else {
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
                $(".thumb-control").on("touchstart", function (e) {
                    e.preventDefault();
                    if (e.touches.length == 1) {
                        $(e.currentTarget).addClass("hover");
                        After.Temp.Dragging = true;
                        After.Temp.StartPoint = e.touches[0];
                        After.Temp.ActiveIcon = $(e.currentTarget);
                        After.Temp.ActiveFrame = $(e.currentTarget).parent();
                        After.Temp.StartWidth = After.Temp.ActiveFrame.width();
                        After.Temp.LastTouch = e.touches[0];
                        window.ontouchmove = function (e) {
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
                            }
                        };
                        window.ontouchend = function (e) {
                            After.Temp.ActiveIcon.removeClass("hover");
                            var totalXDistance = Math.abs(After.Temp.LastTouch.clientX - After.Temp.StartPoint.clientX);
                            var totalYDistance = Math.abs(After.Temp.LastTouch.clientY - After.Temp.StartPoint.clientY);
                            if (totalXDistance < 5 && totalYDistance < 5) {
                                if (After.Temp.ActiveFrame.width() > 0) {
                                    After.Temp.ActiveFrame.css("z-index", 0);
                                    After.Temp.ActiveFrame.animate({ "width": "0" }, 750);
                                    After.Temp.ActiveIcon.animate({ "opacity": ".8" }, 750);
                                }
                                else {
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
                            window.ontouchmove = null;
                            window.ontouchend = null;
                        };
                    }
                });
                $("#svgJoystick").on("touchstart", function (e) {
                    e.preventDefault();
                    if (e.touches.length == 1) {
                        After.Temp.JoystickManipulation = true;
                        window.ontouchmove = function (e) {
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
                        window.ontouchend = function (e) {
                            After.Temp.JoystickManipulation = false;
                            window.ontouchmove = null;
                            window.ontouchend = null;
                            $("#svgJoystick").animate({
                                "margin-left": 0,
                                "margin-top": 0,
                            }, 500);
                        };
                    }
                });
                $("#svgJoystick").on("mousedown", function (e) {
                    e.preventDefault();
                    After.Temp.JoystickManipulation = true;
                    window.onmousemove = function (e) {
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
                    window.onmouseup = function (e) {
                        After.Temp.JoystickManipulation = false;
                        window.onmousemove = null;
                        window.onmouseup = null;
                        window.onmouseleave = null;
                        $("#svgJoystick").animate({
                            "margin-left": 0,
                            "margin-top": 0,
                        }, 500);
                    };
                    window.onmouseleave = function (e) {
                        After.Temp.JoystickManipulation = false;
                        window.onmousemove = null;
                        window.onmouseup = null;
                        window.onmouseleave = null;
                        $("#svgJoystick").animate({
                            "margin-left": 0,
                            "margin-top": 0,
                        }, 500);
                    };
                });
                $(".dpad-direction").on("touchmove", function (e) {
                    e.preventDefault();
                });
                $(".dpad-direction").on("click", function (e) {
                    After.Me.Move($(e.currentTarget).attr("move-direction"));
                });
            }
        };
    })(Controls = After.Controls || (After.Controls = {}));
})(After || (After = {}));
//# sourceMappingURL=Game.js.map