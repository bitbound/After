export const Me = new class {
    constructor() {
        this.EmitterConfig = {
            "alpha": {
                "start": 1,
                "end": 0
            },
            "scale": {
                "start": 0.5,
                "end": 0.5,
                "minimumScaleMultiplier": 0.1
            },
            "color": {
                "start": "#ffffff",
                "end": "#808080"
            },
            "speed": {
                "start": 30,
                "end": 30,
                "minimumSpeedMultiplier": 0.5
            },
            "acceleration": {
                "x": 0,
                "y": 0
            },
            "maxSpeed": 0,
            "startRotation": {
                "min": 0,
                "max": 360
            },
            "noRotation": false,
            "rotationSpeed": {
                "min": 0,
                "max": 0
            },
            "lifetime": {
                "min": 0.5,
                "max": 1.0
            },
            "blendMode": "normal",
            "frequency": 0.001,
            "emitterLifetime": -1,
            "maxParticles": 500,
            "pos": {
                "x": 0,
                "y": 0
            },
            "addAtBack": false,
            "spawnType": "circle",
            "spawnCircle": {
                "x": 0,
                "y": 0,
                "r": 0
            },
            "autoUpdate": true
        };
    }
    CreateEmitter(mainApp) {
        this.Emitter = new PIXI.particles.Emitter(mainApp.stage, ["/Assets/Images/particle.png"], this.EmitterConfig);
        this.Emitter.updateOwnerPos(mainApp.screen.width / 2, mainApp.screen.height / 2);
    }
};
//# sourceMappingURL=Me.js.map