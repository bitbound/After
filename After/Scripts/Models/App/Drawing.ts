namespace After.Models.App {
    export class Drawing {
        constructor() {
        }
        ParticleInterval: number;
        DrawCanvas() {
            try {
                After.Canvas.Context2D = After.Canvas.Context2D || (document.getElementById("#canvasMap") as HTMLCanvasElement).getContext("2d");
                After.Canvas.Context2D.save();
                var alpha = .1 * (60 / After.Canvas.FPSStack.length);
                After.Canvas.Context2D.fillStyle = 'rgba(0,0,0,' + alpha + ')';
                After.Canvas.Context2D.fillRect(0, 0, After.Canvas.Element.width, After.Canvas.Element.height);
                
                After.Drawing.DrawAreas();
                After.Drawing.DrawSoul();

                After.Canvas.FPSStack.push(Date.now());
                while (Date.now() - After.Canvas.FPSStack[0] > 1000) {
                    After.Canvas.FPSStack.splice(0, 1);
                };

                if (After.Debug) {
                    document.getElementById("divFPS").innerHTML = "FPS: " + After.Canvas.FPSStack.length + "<br/> W: " + After.Temp.W + " / H: " + After.Temp.H + "<br/>Scale: " + After.Canvas.ZoomScale.toFixed(2) + "<br/>OffsetX: " + After.Canvas.OffsetX.toFixed(2) + "<br/>OffsetY: " + After.Canvas.OffsetY.toFixed(2);
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
                var scale = After.Canvas.ZoomScale;
                After.Canvas.Context2D.translate(((value.XCoord * 100) + After.Canvas.OffsetX) * scale, ((value.YCoord * 100) + After.Canvas.OffsetY) * scale);
                if (After.Debug) {
                    After.Canvas.Context2D.strokeStyle = "white";
                    After.Canvas.Context2D.lineWidth = 1;
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
        DrawSoul() {
            var c2d = After.Canvas.Context2D;
            var zs = After.Canvas.ZoomScale;
            c2d.save();
            for (var i = 0; i < After.Me.Particles.length; i++) {
                var part = After.Me.Particles[i];

                // Draw particle.
                c2d.fillStyle = After.Me.Color;
                c2d.beginPath();
                var partX = After.Me.ParentBounds.left + (part.CurrentX * zs) + (50 * zs) - ((After.Me.Height - 1) * 2);
                var partY = After.Me.ParentBounds.top + (part.CurrentY * zs) + (30 * zs) - ((After.Me.Height - 1) * 20);
                c2d.arc(partX, partY, .5 * zs * After.Me.Height, 0, Math.PI * 2);
                c2d.strokeStyle = "dimgray"
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
            };
        };
        AnimateParticles() {
            this.ParticleInterval = window.setInterval(function () {
                if (After.Me.CurrentXYZ == null) {
                    return;
                }
                var soul = After.Me;

                // Get the xy coordinate of area's top-left corner.
                var parentX = ((soul.XCoord * 100) + After.Canvas.OffsetX) * After.Canvas.ZoomScale;
                var parentY = ((soul.YCoord * 100) + After.Canvas.OffsetY) * After.Canvas.ZoomScale;
                soul.ParentBounds = {
                    left: parentX,
                    top: parentY,
                    right: parentX + (100 * After.Canvas.ZoomScale),
                    bottom: parentY + (100 * After.Canvas.ZoomScale),
                }

                var particleDiameter = 20;

                // Set bounds within which particles will move.
                if (typeof soul.ParticleBounds == "undefined") {
                    var top = After.Utilities.GetRandom(-25, 25, true);
                    var left = After.Utilities.GetRandom(-25, 15, true);
                    soul.ParticleBounds = {
                        left: left,
                        top: top,
                        right: left + particleDiameter,
                        bottom: top + particleDiameter
                    }
                    soul.ParticleWanderTo = {
                        x: After.Utilities.GetRandom(-25, 15, true),
                        y: After.Utilities.GetRandom(-30, -5, true)
                    }
                }

                // Make particles wander in the area.
                if (Math.round(soul.ParticleBounds.left) != Math.round(soul.ParticleWanderTo.x)) {
                    var change = (soul.ParticleWanderTo.x - soul.ParticleBounds.left) / Math.abs((soul.ParticleWanderTo.x - soul.ParticleBounds.left));
                    soul.ParticleBounds.left += .1 * change;
                }
                else {
                    soul.ParticleWanderTo.x = After.Utilities.GetRandom(-25, 15, true);
                }

                if (Math.round(soul.ParticleBounds.top) != Math.round(soul.ParticleWanderTo.y)) {
                    var change = (soul.ParticleWanderTo.y - soul.ParticleBounds.top) / Math.abs((soul.ParticleWanderTo.y - soul.ParticleBounds.top));
                    soul.ParticleBounds.top += .1 * change;
                }
                else {
                    soul.ParticleWanderTo.y = After.Utilities.GetRandom(-30, -5, true);
                }

                soul.ParticleBounds.right = soul.ParticleBounds.left + particleDiameter;
                soul.ParticleBounds.bottom = soul.ParticleBounds.top + particleDiameter;


                var pb = soul.ParticleBounds;
                // Populate missing particles.
                if (soul.Particles.length < 50) {
                    for (var i2 = soul.Particles.length; i2 < 50; i2++) {
                        var part = new After.Models.Game.Particle();
                        part.CurrentX = After.Utilities.GetRandom(pb.left, pb.right, false);
                        part.FromX = part.CurrentX;
                        part.ToX = After.Utilities.GetRandom(pb.left, pb.right, false);;
                        part.CurrentY = After.Utilities.GetRandom(pb.top, pb.bottom, false);
                        part.FromY = part.CurrentY;
                        part.ToY = After.Utilities.GetRandom(pb.top, pb.bottom, false);;
                        soul.Particles.push(part);
                    };
                }

                // Apply movement to individual particles.
                for (var i2 = 0; i2 < soul.Particles.length; i2++) {
                    var part = soul.Particles[i2];

                    // Get new destination if ToX/Y is reached.
                    if (part.ToX >= part.FromX && part.CurrentX >= part.ToX) {
                        part.FromX = part.ToX;
                        do {
                            part.ToX = After.Utilities.GetRandom(pb.left, pb.right, false);
                        } while (part.FromX == part.ToX);
                    } else if (part.ToX <= part.FromX && part.CurrentX <= part.ToX) {
                        part.FromX = part.ToX;
                        do {
                            part.ToX = After.Utilities.GetRandom(pb.left, pb.right, false);
                        } while (part.FromX == part.ToX);
                    }
                    if (part.ToY >= part.FromY && part.CurrentY >= part.ToY) {
                        part.FromY = part.ToY;
                        do {
                            part.ToY = After.Utilities.GetRandom(pb.top, pb.bottom, false);
                        } while (part.FromY == part.ToY);
                    } else if (part.ToY <= part.FromY && part.CurrentY <= part.ToY) {
                        part.FromY = part.ToY;
                        do {
                            part.ToY = After.Utilities.GetRandom(pb.top, pb.bottom, false);
                        } while (part.FromY == part.ToY);
                    }

                    // Change x value with ease-in-out motion.
                    var halfwayX = (Math.max(part.FromX, part.ToX) - Math.min(part.FromX, part.ToX)) / 2;
                    var travelledX = Math.max(part.FromX, part.CurrentX) - Math.min(part.FromX, part.CurrentX);
                    var distanceFromEndX = halfwayX - Math.abs(halfwayX - travelledX);
                    var changeX = Math.max(.3 * (distanceFromEndX / halfwayX), .1);
                    if (part.ToX > part.CurrentX) {
                        part.CurrentX += changeX;
                    } else if (part.ToX < part.CurrentX) {
                        part.CurrentX -= changeX;
                    };
                    if (isFinite(part.CurrentX) == false) {
                        part.CurrentX = part.ToX;
                    }

                    // Change y value with ease-in-out motion.
                    var halfwayY = (Math.max(part.FromY, part.ToY) - Math.min(part.FromY, part.ToY)) / 2;
                    var travelledY = Math.max(part.FromY, part.CurrentY) - Math.min(part.FromY, part.CurrentY);
                    var distanceFromEndY = halfwayY - Math.abs(halfwayY - travelledY);
                    var changeY = Math.max(.3 * (distanceFromEndY / halfwayY), .1);
                    if (part.ToY > part.CurrentY) {
                        part.CurrentY += changeY;
                    } else if (part.ToY < part.CurrentY) {
                        part.CurrentY -= changeY;
                    };
                    if (isFinite(part.CurrentY) == false) {
                        part.CurrentY = part.ToY;
                    }
                }
            }, 20)
        }
    }
}