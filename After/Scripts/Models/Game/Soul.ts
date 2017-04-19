namespace After.Models.Game {
    export class Soul {
        constructor() {
            this.Type = "Soul";
            this.Name = "";
            this.XCoord = 0;
            this.YCoord = 0;
            this.ZCoord = "0";
            this.Height = 1;
            this.Color = "gray";
            this.Particles = new Array<Particle>();
            this.AnimateParticles();
        };
        Type: string;
        CharacterID: number;
        Name: string;
        XCoord: number;
        YCoord: number;
        ZCoord: string;
        CurrentXYZ: string;
        Height: number;
        CrowdScale: number;
        ParticleBounds: {
            top: number,
            right: number,
            bottom: number,
            left: number
        }
        ParentBounds: {
            top: number,
            right: number,
            bottom: number,
            left: number
        };
        Particles: Array<Particle>;
        ParticleInterval: number;
        Color: string;
        AnimateParticles() {
            this.ParticleInterval = window.setInterval(function (Soul: After.Models.Game.Soul) {
                if (After.World_Data.Souls.indexOf(Soul) == -1) {
                    window.clearInterval(Soul.ParticleInterval);
                    delete this;
                    return;
                }
                // X was 20 to 35.  Y was 30 to 45.
                var parentX = ((Soul.XCoord * 100) + After.Canvas.OffsetX) * After.Canvas.ZoomScale;
                var parentY = ((Soul.YCoord * 100) + After.Canvas.OffsetY) * After.Canvas.ZoomScale;
                Soul.ParentBounds = {
                    top: parentY,
                    right: parentX + (100 * After.Canvas.ZoomScale),
                    bottom: parentY + (100 * After.Canvas.ZoomScale),
                    left: parentX,
                }


                var soulsInThisArea = After.World_Data.Souls.filter(function (value, index) {
                    return value.CurrentXYZ == Soul.CurrentXYZ;
                });
                var sqrt = Math.sqrt(soulsInThisArea.length);
                var rows = Math.floor(sqrt);
                var columns = Math.ceil(sqrt);
                var position = soulsInThisArea.indexOf(Soul) + 1;
                var row = Math.ceil(position / columns);
                var column = position - (columns * (row - 1));

                Soul.CrowdScale = 1 / columns;

                var xCenter = 50;
                var yCenter = 30;
                var centerRow = rows / 2 + .5;
                var centerColumn = columns / 2 + .5;

                var xOffset = row - centerRow;
                var yOffset = column - centerColumn;

                var particleDiameter = 20 * Soul.CrowdScale;
                var particleRadius = (particleDiameter / 2);
                var top = (yOffset * particleDiameter) + yCenter - particleRadius;
                var left = (xOffset * particleDiameter) + xCenter - particleRadius;

                Soul.ParticleBounds = {
                    top: top,
                    left: left,
                    right: left + particleDiameter,
                    bottom: top + particleDiameter
                }
                
                var pb = Soul.ParticleBounds;

                if (Soul.Particles.length < 50) {
                    for (var i = Soul.Particles.length; i < 50; i++) {
                        var part = new After.Models.Game.Particle();
                        part.CurrentX = After.Utilities.GetRandom(pb.left, pb.right, false);
                        part.FromX = part.CurrentX;
                        part.ToX = After.Utilities.GetRandom(pb.left, pb.right, false);;
                        part.CurrentY = After.Utilities.GetRandom(pb.top, pb.bottom, false);
                        part.FromY = part.CurrentY;
                        part.ToY = After.Utilities.GetRandom(pb.top, pb.bottom, false);;
                        Soul.Particles.push(part);
                    };
                }

                for (var i = 0; i < Soul.Particles.length; i++) {
                    var part = Soul.Particles[i];
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
            }, 20, this)
        }
    }
}