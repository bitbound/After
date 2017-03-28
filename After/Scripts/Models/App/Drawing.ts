namespace After.Models.App {
    export class Drawing {
        DrawCanvas() {
            try {
                After.Canvas.Context2D = After.Canvas.Context2D || (document.getElementById("#canvasMap") as HTMLCanvasElement).getContext("2d");
                After.Canvas.Context2D.save();
                var alpha = .1 * (60 / After.Canvas.FPSStack.length);
                After.Canvas.Context2D.fillStyle = 'rgba(0,0,0,' + alpha + ')';
                After.Canvas.Context2D.fillRect(0, 0, After.Canvas.Element.width, After.Canvas.Element.height);

                After.Drawing.DrawAreas();
                After.Drawing.DrawSouls();

                After.Canvas.FPSStack.push(Date.now());
                while (Date.now() - After.Canvas.FPSStack[0] > 1000) {
                    After.Canvas.FPSStack.splice(0, 1);
                };

                if (After.Debug) {
                    document.getElementById("divFPS").innerHTML = "FPS: " + After.Canvas.FPSStack.length + "<br/> W: " + After.Temp.W + " / H: " + After.Temp.H + "<br/>Scale: " + After.Canvas.Scale.toFixed(2) + "<br/>OffsetX: " + After.Canvas.OffsetX.toFixed(2) + "<br/>OffsetY: " + After.Canvas.OffsetY.toFixed(2);
                }

                window.requestAnimationFrame(After.Drawing.DrawCanvas);
            }
            catch (e) {
                After.Canvas.Context2D.restore();
                window.requestAnimationFrame(After.Drawing.DrawCanvas);
                throw e;
            }
        };
        DrawAreas() {
            After.World_Data.Areas.forEach(function (value, index) {
                After.Canvas.Context2D.save();
                var scale = After.Canvas.Scale;
                After.Canvas.Context2D.translate(((value.XCoord * 100) + After.Canvas.OffsetX) * scale, ((value.YCoord * 100) + After.Canvas.OffsetY) * scale);
                if (After.Debug) {
                    After.Canvas.Context2D.strokeStyle = "white";
                    After.Canvas.Context2D.strokeRect(0, 0, 100 * scale, 100 * scale);
                }

                // Draw the "selection" background glow.
                if (value.IsSelected) {
                    var rg = After.Canvas.Context2D.createRadialGradient(50 * scale, 50 * scale, 10 * scale, 50 * scale, 50 * scale, 50 * scale);
                    rg.addColorStop(0, "white");
                    rg.addColorStop(1, "transparent");
                    After.Canvas.Context2D.fillStyle = rg;
                    After.Canvas.Context2D.beginPath();
                    After.Canvas.Context2D.arc(50 * scale, 50 * scale, 50 * scale, 0, Math.PI * 2);
                    After.Canvas.Context2D.fill();
                }

                // Scale Y to make arcs ellipses.
                After.Canvas.Context2D.scale(1, .5);
                After.Canvas.Context2D.translate(0, 50 * scale);


                // Draw bottom gray ellipse that becomes the "side wall" for 3D effect.
                After.Canvas.Context2D.fillStyle = "gray";
                After.Canvas.Context2D.beginPath();
                After.Canvas.Context2D.arc(50 * scale, 58 * scale, 30 * scale, 0, Math.PI * 2);
                After.Canvas.Context2D.fill();

                // Bridge space between bottom and top ellipse.
                After.Canvas.Context2D.fillRect(20 * scale, 50 * scale, 4 * scale, 8 * scale);
                After.Canvas.Context2D.fillRect(76 * scale, 50 * scale, 4 * scale, 8 * scale);

                // Draw top ellipse with gradient.
                var gradient = After.Canvas.Context2D.createLinearGradient(50 * scale, 0, 50 * scale, 100 * scale);
                gradient.addColorStop(0, value.Color);
                gradient.addColorStop(1, "white");
                After.Canvas.Context2D.fillStyle = gradient;
                After.Canvas.Context2D.beginPath();
                After.Canvas.Context2D.arc(50 * scale, 50 * scale, 30 * scale, 0, Math.PI * 2);
                After.Canvas.Context2D.fill();

                After.Canvas.Context2D.restore();
            });
        };
        DrawSouls() {
            // TODO: Differentiate between self and others.
            After.World_Data.Souls.forEach(function (value, index) {
                var c2d = After.Canvas.Context2D;
                var scale = After.Canvas.Scale;
                c2d.save();

                var parentX = ((value.XCoord * 100) + After.Canvas.OffsetX) * scale;
                var parentY = ((value.YCoord * 100) + After.Canvas.OffsetY) * scale;
                value.ParentBounds = {
                    top: parentY,
                    right: parentX,
                    bottom: parentY,
                    left: parentX,
                }
                if (value.Particles.length < 50) {
                    for (var i = value.Particles.length; i < 50; i++) {
                        var part = new After.Models.Game.Particle();
                        part.CurrentX = After.Utilities.GetRandom(20, 35, true);
                        part.FromX = part.CurrentX;
                        part.ToX = After.Utilities.GetRandom(20, 35, true);
                        part.CurrentY = After.Utilities.GetRandom(30, 45, true);
                        part.FromY = part.CurrentY;
                        part.ToY = After.Utilities.GetRandom(30, 45, true);
                        value.Particles.push(part);
                    };
                }

                for (var i = 0; i < value.Particles.length; i++) {
                    var part = value.Particles[i];
                    if (part.ToX >= part.FromX && part.CurrentX >= part.ToX) {
                        part.FromX = part.ToX;
                        do {
                            part.ToX = After.Utilities.GetRandom(20, 35, true);
                        } while (part.FromX == part.ToX);
                    } else if (part.ToX <= part.FromX && part.CurrentX <= part.ToX) {
                        part.FromX = part.ToX;
                        do {
                            part.ToX = After.Utilities.GetRandom(20, 35, true);
                        } while (part.FromX == part.ToX);
                    }
                    if (part.ToY >= part.FromY && part.CurrentY >= part.ToY) {
                        part.FromY = part.ToY;
                        do {
                            part.ToY = After.Utilities.GetRandom(30, 45, true);
                        } while (part.FromY == part.ToY);
                    } else if (part.ToY <= part.FromY && part.CurrentY <= part.ToY) {
                        part.FromY = part.ToY;
                        do {
                            part.ToY = After.Utilities.GetRandom(30, 45, true);
                        } while (part.FromY == part.ToY);
                    }

                    var halfwayX = (Math.max(part.FromX, part.ToX) - Math.min(part.FromX, part.ToX)) / 2;
                    var travelledX = Math.max(part.FromX, part.CurrentX) - Math.min(part.FromX, part.CurrentX);
                    var distanceFromEndX = halfwayX - Math.abs(halfwayX - travelledX);
                    var changeX = Math.max(.3 * (distanceFromEndX / halfwayX), .1) * (60 / After.Canvas.FPSStack.length);
                    if (part.ToX > part.CurrentX) {
                        part.CurrentX += changeX;
                    } else if (part.ToX < part.CurrentX) {
                        part.CurrentX -= changeX;
                    };
                    if (isFinite(part.CurrentX) == false) {
                        part.CurrentX = part.ToX;
                    }

                    var halfwayY = (Math.max(part.FromY, part.ToY) - Math.min(part.FromY, part.ToY)) / 2;
                    var travelledY = Math.max(part.FromY, part.CurrentY) - Math.min(part.FromY, part.CurrentY);
                    var distanceFromEndY = halfwayY - Math.abs(halfwayY - travelledY);
                    var changeY = Math.max(.3 * (distanceFromEndY / halfwayY), .1) * (60 / After.Canvas.FPSStack.length);
                    if (part.ToY > part.CurrentY) {
                        part.CurrentY += changeY;
                    } else if (part.ToY < part.CurrentY) {
                        part.CurrentY -= changeY;
                    };
                    if (isFinite(part.CurrentY) == false) {
                        part.CurrentY = part.ToY;
                    }

                    c2d.fillStyle = value.Color;
                    c2d.beginPath();
                    c2d.arc(value.ParentBounds.left + (part.CurrentX * scale), value.ParentBounds.top + (part.CurrentY * scale), .5 * scale, 0, Math.PI * 2);
                    c2d.fill();

                    c2d.fillStyle = "dimgray";
                    c2d.globalAlpha = .1;
                    c2d.beginPath();
                    c2d.arc(value.ParentBounds.left + (part.CurrentX * scale) + (3 * scale), value.ParentBounds.top + (part.CurrentY * scale) + (10 * scale), .75 * scale, 0, Math.PI * 2);
                    c2d.fill();
                    c2d.globalAlpha = 1;

                    c2d.restore();
                    c2d.shadowOffsetX = 0;
                    c2d.shadowOffsetY = 0;
                    c2d.shadowBlur = 0;
                };
            });
        }
    }
}