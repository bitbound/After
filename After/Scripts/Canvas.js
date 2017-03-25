var After;
(function (After) {
    After.Canvas = {
        Element: {},
        Context2D: {},
        SelectedObject: {},
        OffsetX: 0,
        OffsetY: 0,
        CurrentZ: 0,
        Scale: 1,
        ScaleChange: 1,
        InertiaX: 0,
        InertiaY: 0,
        StartDragX: 0,
        StartDragY: 0,
        StartOffsetX: 0,
        StartOffsetY: 0,
        LastTouchPoint1: {},
        LastTouchPoint2: {},
        LastTouchDistance: 0,
        InertiaStack: [],
        IsPanning: false,
        IsZooming: false,
        FPSStack: new Array(),
        SelectPoint: function (e) {
            // TODO: Select object based on coords.
            var xTotal = e.clientX / After.Canvas.Scale - After.Canvas.OffsetX;
            var yTotal = e.clientY / After.Canvas.Scale - After.Canvas.OffsetY;
            var xCoord = Math.floor(xTotal / 100);
            var yCoord = Math.floor(yTotal / 100);
            var xRemainder = xTotal - (xCoord * 100);
            var yRemainder = yTotal - (yCoord * 100);
            var area = After.World_Data.Areas.filter(function (a) {
                if (a.XCoord == xCoord && a.YCoord == yCoord) {
                    return true;
                }
                else {
                    return false;
                }
            });
            if (After.Canvas.SelectedObject == area[0]) {
                After.Canvas.SelectedObject.IsSelected = !After.Canvas.SelectedObject.IsSelected;
            }
            else {
                if (After.Canvas.SelectedObject) {
                    After.Canvas.SelectedObject.IsSelected = false;
                }
                After.Canvas.SelectedObject = area[0];
                if (After.Canvas.SelectedObject) {
                    After.Canvas.SelectedObject.IsSelected = true;
                }
            }
        },
        ApplyInertia: function () {
            After.Canvas.InertiaX = 0;
            After.Canvas.InertiaY = 0;
            After.Canvas.IsPanning = false;
            if (After.Canvas.InertiaStack.length == 1) {
                return;
            }
            for (var i = After.Canvas.InertiaStack.length - 1; i > 0; i--) {
                var thisEvent = After.Canvas.InertiaStack[i].Event;
                var lastEvent = After.Canvas.InertiaStack[i - 1].Event;
                var thisTime = After.Canvas.InertiaStack[i].Timestamp;
                var lastTime = After.Canvas.InertiaStack[i - 1].Timestamp;
                var xChange = (thisEvent.clientX - lastEvent.clientX) * ((lastTime / thisTime) + .25);
                var yChange = (thisEvent.clientY - lastEvent.clientY) * ((lastTime / thisTime) + .25);
                if (i == After.Canvas.InertiaStack.length - 1) {
                    After.Canvas.InertiaX += xChange * 1.5;
                    After.Canvas.InertiaY += yChange * 1.5;
                }
                else {
                    After.Canvas.InertiaX += xChange;
                    After.Canvas.InertiaY += yChange;
                }
            }
            After.Canvas.InertiaX /= (After.Canvas.InertiaStack.length + .5);
            After.Canvas.InertiaY /= (After.Canvas.InertiaStack.length + .5);
            After.Canvas.InertiaX = Math.round(After.Canvas.InertiaX);
            After.Canvas.InertiaY = Math.round(After.Canvas.InertiaY);
            if (After.Temp.InertiaInterval) {
                window.clearInterval(After.Temp.InertiaInterval);
            }
            After.Temp.InertiaInterval = window.setInterval(function () {
                if (After.Canvas.InertiaX != 0) {
                    After.Canvas.InertiaX -= (After.Canvas.InertiaX * .05);
                }
                if (After.Canvas.InertiaY != 0) {
                    After.Canvas.InertiaY -= (After.Canvas.InertiaY * .05);
                }
                if (After.Canvas.IsPanning == false) {
                    if (Math.abs(After.Canvas.InertiaX) < 1) {
                        After.Canvas.InertiaX = 0;
                    }
                    if (Math.abs(After.Canvas.InertiaY) < 1) {
                        After.Canvas.InertiaY = 0;
                    }
                    if (After.Canvas.InertiaX == 0 && After.Canvas.InertiaY == 0) {
                        window.clearInterval(After.Temp.InertiaInterval);
                    }
                    After.Canvas.OffsetX += (After.Canvas.InertiaX / After.Canvas.Scale);
                    After.Canvas.OffsetY += (After.Canvas.InertiaY / After.Canvas.Scale);
                }
                else {
                    After.Canvas.InertiaX = 0;
                    After.Canvas.InertiaY = 0;
                    window.clearInterval(After.Temp.InertiaInterval);
                }
            }, 20);
        }
    };
})(After || (After = {}));
//# sourceMappingURL=Canvas.js.map