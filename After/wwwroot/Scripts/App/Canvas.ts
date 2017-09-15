namespace After.App {
    export class Canvas {
        constructor() {
            this._offsetX = 0;
            this._offsetY = 0;
            this.CurrentZ = "0";
            this.ZoomScale = 1;
            this.ScaleChange = 1;
            this.InertiaX = 0;
            this.InertiaY = 0;
            this.StartDragX = 0;
            this.StartDragY = 0;
            this.StartOffsetX = 0;
            this.StartOffsetY = 0;
            this.LastTouchDistance = 0;
            this.IsPanning = false;
            this.IsZooming = false;
            this.InertiaStack = new Array<any>();
            this.FPSStack = new Array<number>();
        }
        Element: HTMLCanvasElement;
        Context2D: CanvasRenderingContext2D;
        SelectedObject: After.Models.Bases.Selectable;
        private _offsetX: number;
        get OffsetX(): number {
            return this._offsetX;
        };
        set OffsetX(Value: number) {
            this._offsetX = Value;
            After.Canvas.UpdateMap(false);
        }

        private _offsetY: number;
        get OffsetY(): number {
            return this._offsetY;
        };
        set OffsetY(Value: number) {
            this._offsetY = Value;
            After.Canvas.UpdateMap(false);
        };
        get CenterCoordinate():string {
            var xTotal = After.Canvas.Element.clientWidth / 2 / After.Canvas.ZoomScale - After.Canvas.OffsetX;
            var yTotal = After.Canvas.Element.clientHeight / 2 / After.Canvas.ZoomScale - After.Canvas.OffsetY;
            var xCoord = Math.floor(xTotal / 100);
            var yCoord = Math.floor(yTotal / 100);
            return String(xCoord) + "," + String(yCoord) + "," + After.Canvas.CurrentZ;
        };
        CurrentZ: string;
        ZoomScale: number;
        ScaleChange: number;
        InertiaX: number;
        InertiaY: number;
        StartDragX: number;
        StartDragY: number;
        StartOffsetX: number;
        StartOffsetY: number;
        LastTouchPoint1: Touch;
        LastTouchPoint2: Touch;
        LastTouchDistance: number;
        InertiaStack: Array<any>;
        IsPanning: boolean;
        IsZooming: boolean;
        FPSStack: Array<number>;
        SelectPoint(e: MouseEvent|Touch) {
            var xTotal = e.clientX / After.Canvas.ZoomScale - After.Canvas.OffsetX;
            var yTotal = e.clientY / After.Canvas.ZoomScale - After.Canvas.OffsetY;
            var xCoord = Math.floor(xTotal / 100);
            var yCoord = Math.floor(yTotal / 100);
            var xRemainder = xTotal - (xCoord * 100);
            var yRemainder = yTotal - (yCoord * 100);
            var area = After.Storage.Areas.find(function (a) {
                return a.XCoord == xCoord && a.YCoord == yCoord;
            });
            if (typeof area != "undefined" && After.Utilities.NumberIsBetween(xRemainder, 43, 57, true) && After.Utilities.NumberIsBetween(yRemainder, 54.5, 62.5, true)) {
                area.IsInteractButtonDepressed = true;
                window.setTimeout(function (area) {
                    area.IsInteractButtonDepressed = false;
                }, 500, area);
                var request = {
                    "Category": "Queries",
                    "Type": "GetAreaActions",
                    "TargetXYZ": area.StorageID
                };
                After.Connection.Socket.send(JSON.stringify(request));
                After.Temp.ButtonPoint = e;
                return;
            }
            if (typeof area != "undefined" && After.Utilities.NumberIsBetween(xRemainder, 37.5, 46, true) && After.Utilities.NumberIsBetween(yRemainder, 85, 93, true)) {
                var request = {
                    "Category": "Queries",
                    "Type": "GetAreaOccupants",
                    "TargetXYZ": area.StorageID
                };
                After.Connection.Socket.send(JSON.stringify(request));
                After.Temp.ButtonPoint = e;
                return;
            }
            if (After.Canvas.SelectedObject != undefined && After.Canvas.SelectedObject == area)
            {
                After.Canvas.SelectedObject.IsSelected = !After.Canvas.SelectedObject.IsSelected;
            }
            else
            {
                if (After.Canvas.SelectedObject) {
                    After.Canvas.SelectedObject.IsSelected = false;
                }
                After.Canvas.SelectedObject = area;
                if (After.Canvas.SelectedObject) {
                    After.Canvas.SelectedObject.IsSelected = true;
                }
            }
        };
        CenterOnCoords(X: number, Y: number, ResetZoom: boolean, SmoothScroll: boolean) {
            var toZoom;
            if (ResetZoom) {
                toZoom = 1;
            }
            else {
                toZoom = After.Canvas.ZoomScale;
            }
            if (SmoothScroll) {
                $(After.Canvas).animate({
                    "ZoomScale": toZoom,
                    "OffsetX": (-X * 100) + (After.Canvas.Element.width / 2 / toZoom) - (50),
                    "OffsetY": (-Y * 100) + (After.Canvas.Element.height / 2 / toZoom) - (50)
                }, 500);
            }
            else {
                After.Canvas.ZoomScale = toZoom;
                After.Canvas.OffsetX = (-X * 100) + (After.Canvas.Element.width / 2 / toZoom) - (50);
                After.Canvas.OffsetY = (-Y * 100) + (After.Canvas.Element.height / 2 / toZoom) - (50);
            }
        };
        ApplyInertia() {
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
                    After.Canvas.OffsetX += (After.Canvas.InertiaX / After.Canvas.ZoomScale);
                    After.Canvas.OffsetY += (After.Canvas.InertiaY / After.Canvas.ZoomScale);
                }
                else {
                    After.Canvas.InertiaX = 0;
                    After.Canvas.InertiaY = 0;
                    window.clearInterval(After.Temp.InertiaInterval);
                }
            }, 20);
        }
        UpdateMap(Force:boolean) {
            if (After.Temp.MapUpdatePending && !Force) {
                return;
            }
            var centerCoord = After.Canvas.CenterCoordinate;
            if (After.Temp.PreviousCenter != centerCoord) {
                After.Temp.MapUpdatePending = true;
                var xMin = Math.floor(-After.Canvas.OffsetX / 100);
                var xMax = Math.ceil((After.Canvas.Element.clientWidth / After.Canvas.ZoomScale - After.Canvas.OffsetX) / 100);
                var yMin = Math.floor(-After.Canvas.OffsetY / 100);
                var yMax = Math.ceil((After.Canvas.Element.clientHeight / After.Canvas.ZoomScale - After.Canvas.OffsetY) / 100);

                for (var i = After.Storage.Areas.length - 1; i >= 0; i--) {
                    var area = After.Storage.Areas[i];
                    if (area.IsVisible) {
                        continue;
                    }
                    if (!After.Utilities.NumberIsBetween(area.XCoord, xMin, xMax, true) || !After.Utilities.NumberIsBetween(area.YCoord, yMin, yMax, true)) {
                        After.Storage.Areas.splice(i, 1);
                    }
                }
                for (var i = After.Storage.Landmarks.length - 1; i >= 0; i--) {
                    var landmark = After.Storage.Landmarks[i];
                    if (!After.Utilities.NumberIsBetween(landmark.XCoord, xMin, xMax, true) || !After.Utilities.NumberIsBetween(landmark.YCoord, yMin, yMax, true)) {
                        After.Storage.Landmarks.splice(i, 1);
                    }
                }
                var request = {
                    "Category": "Queries",
                    "Type": "MapUpdate",
                    "XMin": xMin,
                    "XMax": xMax,
                    "YMin": yMin,
                    "YMax": yMax
                }
                After.Connection.Socket.send(JSON.stringify(request));
            }
            After.Temp.PreviousCenter = centerCoord;
        }
    }
}