var After;
(function (After) {
    var App;
    (function (App) {
        class Drawing {
            constructor() {
                this.AreaInteractIcon = document.createElement("img");
                this.AreaInteractIcon.src = "/Assets/Images/Icons/InteractiveColor.png";
            }
            DrawCanvas() {
                try {
                    After.Canvas.Context2D = After.Canvas.Context2D || document.getElementById("#canvasMap").getContext("2d");
                    After.Canvas.Context2D.save();
                    var alpha = .1 * (60 / After.Canvas.FPSStack.length);
                    After.Canvas.Context2D.fillStyle = 'rgba(0,0,0,' + alpha + ')';
                    After.Canvas.Context2D.fillRect(0, 0, After.Canvas.Element.width, After.Canvas.Element.height);
                    After.Drawing.DrawLandmarks();
                    After.Drawing.DrawAreas();
                    After.Drawing.DrawFreeParticles();
                    After.Drawing.DrawSoul();
                    After.Canvas.FPSStack.push(Date.now());
                    while (Date.now() - After.Canvas.FPSStack[0] > 1000) {
                        After.Canvas.FPSStack.splice(0, 1);
                    }
                    ;
                    if (After.Debug) {
                        document.getElementById("divDebug").innerHTML = "FPS: " + After.Canvas.FPSStack.length + "<br/> W: " + document.documentElement.clientWidth + " / H: " + document.documentElement.clientHeight + "<br/>Scale: " + After.Canvas.ZoomScale.toFixed(2) + "<br/>OffsetX: " + After.Canvas.OffsetX.toFixed(2) + "<br/>OffsetY: " + After.Canvas.OffsetY.toFixed(2) + "<br/>Center XYZ:" + After.Canvas.CenterCoordinate;
                    }
                    window.requestAnimationFrame(After.Drawing.DrawCanvas);
                }
                catch (e) {
                    After.Canvas.Context2D.restore();
                    window.requestAnimationFrame(After.Drawing.DrawCanvas);
                    throw e;
                }
            }
            ;
            DrawLandmarks() {
                var c2d = After.Canvas.Context2D;
                After.Storage.Landmarks.forEach(function (value, index) {
                    c2d.save();
                    var scale = After.Canvas.ZoomScale;
                    c2d.translate(((value.XCoord * 100) + After.Canvas.OffsetX) * scale, ((value.YCoord * 100) + After.Canvas.OffsetY) * scale);
                    c2d.scale(1, .5);
                    var fontSize = value.FontSize * scale;
                    c2d.fillStyle = value.Color;
                    c2d.font = String(fontSize) + "px " + value.FontStyle;
                    var measure = c2d.measureText(value.Text);
                    c2d.fillText(value.Text, 50 * scale - measure.width / 2, 0);
                    c2d.restore();
                });
            }
            ;
            DrawAreas() {
                var c2d = After.Canvas.Context2D;
                After.Storage.Areas.forEach(function (value, index) {
                    c2d.save();
                    var scale = After.Canvas.ZoomScale;
                    c2d.translate(((value.XCoord * 100) + After.Canvas.OffsetX) * scale, ((value.YCoord * 100) + After.Canvas.OffsetY) * scale);
                    if (After.Debug) {
                        c2d.strokeStyle = "white";
                        c2d.lineWidth = 1;
                        c2d.strokeRect(0, 0, 100 * scale, 100 * scale);
                    }
                    if (value.IsVisible) {
                        c2d.globalAlpha = 1;
                    }
                    else {
                        c2d.globalAlpha = .1;
                    }
                    // Draw the "selection" background glow.
                    if (value.IsSelected) {
                        var rg = c2d.createRadialGradient(50 * scale, 50 * scale, 10 * scale, 50 * scale, 50 * scale, 50 * scale);
                        rg.addColorStop(0, "white");
                        rg.addColorStop(1, "transparent");
                        c2d.fillStyle = rg;
                        c2d.beginPath();
                        c2d.arc(50 * scale, 50 * scale, 50 * scale, 0, Math.PI * 2);
                        c2d.fill();
                    }
                    // Draw area title.
                    var fontSize = 6 * scale;
                    c2d.fillStyle = "white";
                    c2d.font = String(fontSize) + "px sans-serif";
                    var measure = c2d.measureText(value.Title);
                    c2d.fillText(value.Title, 50 * scale - measure.width / 2, 20 * scale, 80 * scale);
                    // Scale Y to make arcs ellipses.
                    c2d.scale(1, .5);
                    c2d.translate(0, 50 * scale);
                    // Draw bottom gray ellipse that becomes the "side wall" for 3D effect.
                    c2d.fillStyle = "gray";
                    c2d.beginPath();
                    c2d.moveTo(80 * scale, 50 * scale);
                    c2d.lineTo(80 * scale, 58 * scale);
                    c2d.arc(50 * scale, 58 * scale, 30 * scale, 0, Math.PI * 1);
                    c2d.lineTo(20 * scale, 50 * scale);
                    c2d.closePath();
                    c2d.fill();
                    // Draw top ellipse with gradient.
                    var gradient = c2d.createLinearGradient(50 * scale, 0, 50 * scale, 100 * scale);
                    gradient.addColorStop(0, value.Color);
                    gradient.addColorStop(1, "white");
                    c2d.fillStyle = gradient;
                    c2d.beginPath();
                    c2d.arc(50 * scale, 50 * scale, 30 * scale, 0, Math.PI * 2);
                    c2d.fill();
                    // Draw interact button.
                    // Base for 3D look.
                    c2d.fillStyle = "dimgray";
                    c2d.beginPath();
                    c2d.moveTo(57 * scale, 67 * scale);
                    c2d.lineTo(57 * scale, 68 * scale);
                    c2d.arc(50 * scale, 68 * scale, 7 * scale, 0, Math.PI * 1);
                    c2d.lineTo(43 * scale, 67 * scale);
                    c2d.closePath();
                    c2d.fill();
                    // Top surface.
                    var yAdjust;
                    if (value.IsInteractButtonDepressed) {
                        yAdjust = 1.5;
                    }
                    else {
                        yAdjust = 0;
                    }
                    c2d.fillStyle = "gray";
                    c2d.strokeStyle = "white";
                    c2d.lineWidth = .25 * scale;
                    c2d.beginPath();
                    c2d.arc(50 * scale, (66 + yAdjust) * scale, 7 * scale, 0, Math.PI * 2);
                    c2d.fill();
                    c2d.stroke();
                    c2d.drawImage(After.Drawing.AreaInteractIcon, 45 * scale, (61 + yAdjust) * scale, 10 * scale, 10 * scale);
                    c2d.scale(1, 2);
                    // Draw area info.
                    c2d.strokeStyle = "white";
                    c2d.fillStyle = "white";
                    var fontSize = 6 * scale;
                    c2d.font = String(fontSize) + "px sans-serif";
                    var text = "X: " + String(value.XCoord) + ", Y: " + String(value.YCoord);
                    measure = c2d.measureText(text);
                    c2d.fillText(text, 50 * scale - measure.width / 2, 55 * scale, 60 * scale);
                    if (value.IsVisible) {
                        text = ": " + String(value.Occupants.length);
                        measure = c2d.measureText(text);
                        c2d.drawImage($("#divCharacterIconBorder img")[0], 50 * scale - measure.width / 2 - 9 * scale, 60 * scale, 8 * scale, 8 * scale);
                        c2d.fillText(text, 50 * scale - measure.width / 2, 67 * scale, 50 * scale);
                    }
                    c2d.restore();
                });
            }
            ;
            DrawFreeParticles() {
                var c2d = After.Canvas.Context2D;
                var zs = After.Canvas.ZoomScale;
                c2d.save();
                for (var i = 0; i < After.Storage.FreeParticles.length; i++) {
                    var part = After.Storage.FreeParticles[i];
                    // Draw particle.
                    c2d.fillStyle = part.Color;
                    c2d.beginPath();
                    var partX = ((part.XCoord * 100) + After.Canvas.OffsetX) * After.Canvas.ZoomScale;
                    var partY = ((part.YCoord * 100) + After.Canvas.OffsetY) * After.Canvas.ZoomScale;
                    c2d.arc(partX, partY, .5 * zs, 0, Math.PI * 2);
                    c2d.strokeStyle = "dimgray";
                    c2d.lineWidth = .25 * zs;
                    c2d.stroke();
                    c2d.fill();
                    // Draw shadow.
                    c2d.fillStyle = "dimgray";
                    c2d.globalAlpha = .1;
                    c2d.beginPath();
                    c2d.arc(partX + (3 * zs), partY + (10 * zs), .75 * zs, 0, Math.PI * 2);
                    c2d.fill();
                    c2d.globalAlpha = 1;
                    c2d.restore();
                    c2d.shadowOffsetX = 0;
                    c2d.shadowOffsetY = 0;
                    c2d.shadowBlur = 0;
                }
            }
            ;
            DrawSoul() {
                var c2d = After.Canvas.Context2D;
                var zs = After.Canvas.ZoomScale;
                c2d.save();
                for (var i = 0; i < After.Me.Particles.length; i++) {
                    var part = After.Me.Particles[i];
                    // Get the xy coordinate of area's top-left corner.
                    var baseX = ((part.XCoord * 100) + After.Canvas.OffsetX) * After.Canvas.ZoomScale;
                    var baseY = ((part.YCoord * 100) + After.Canvas.OffsetY) * After.Canvas.ZoomScale;
                    // Draw particle.
                    c2d.fillStyle = After.Me.Color;
                    c2d.beginPath();
                    var partX = baseX + (part.CurrentX * zs) + (50 * zs) - ((After.Me.Height - 1) * 2);
                    var partY = baseY + (part.CurrentY * zs) + (30 * zs) - ((After.Me.Height - 1) * 20);
                    c2d.arc(partX, partY, .5 * zs * After.Me.Height, 0, Math.PI * 2);
                    c2d.strokeStyle = "dimgray";
                    c2d.lineWidth = .25 * zs * After.Me.Height;
                    c2d.stroke();
                    c2d.fill();
                    // Draw shadow.
                    c2d.fillStyle = "dimgray";
                    c2d.globalAlpha = .1;
                    c2d.beginPath();
                    c2d.arc(partX + (3 * zs * After.Me.Height), partY + (10 * zs * After.Me.Height), .75 * zs / After.Me.Height, 0, Math.PI * 2);
                    c2d.fill();
                    c2d.globalAlpha = 1;
                    c2d.restore();
                    c2d.shadowOffsetX = 0;
                    c2d.shadowOffsetY = 0;
                    c2d.shadowBlur = 0;
                }
                ;
            }
            ;
            AnimateParticles() {
                var soul = After.Me;
                // Set bounds within which particles will move.
                var top = After.Utilities.GetRandom(-25, 25, true);
                var left = After.Utilities.GetRandom(-25, 15, true);
                soul.ParticleBounds = {
                    left: -10,
                    top: -20,
                    right: 10,
                    bottom: 0
                };
                // Make particles wander in the area.
                soul.ParticleWanderTo["x"] = After.Utilities.GetRandom(-25, 15, true);
                soul.ParticleWanderTo["y"] = After.Utilities.GetRandom(-30, -5, true);
                After.Me.WanderParticlesX();
                After.Me.WanderParticlesY();
                var pb = soul.ParticleBounds;
                // Populate particles.
                for (var i = soul.Particles.length; i < 50; i++) {
                    var part = new After.Models.Particle();
                    part.CurrentX = After.Utilities.GetRandom(pb.left, pb.right, false);
                    part.XCoord = After.Me.XCoord;
                    part.ToX = part.CurrentX;
                    part.CurrentY = After.Utilities.GetRandom(pb.top, pb.bottom, false);
                    part.ToY = part.CurrentY;
                    part.YCoord = After.Me.YCoord;
                    soul.Particles.push(part);
                }
                ;
                // Apply movement to individual particles.
                for (var i = 0; i < soul.Particles.length; i++) {
                    After.Me.MoveParticleX(soul.Particles[i]);
                    After.Me.MoveParticleY(soul.Particles[i]);
                }
            }
        }
        App.Drawing = Drawing;
    })(App = After.App || (After.App = {}));
})(After || (After = {}));
