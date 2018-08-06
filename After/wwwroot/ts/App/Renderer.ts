import { Settings } from "./Settings.js";

export const Renderer = new class {
    PixiApp: PIXI.Application;
    SceneContainer: PIXI.Container = new PIXI.Container();
    BackgroundEmitter: PIXI.particles.Emitter;
    BackgroundParticleContainer: PIXI.particles.ParticleContainer;
    CreatePixiApp(width: number, height: number) {
        this.PixiApp = new PIXI.Application({
            view: document.querySelector("#playCanvas"),
            width: width,
            height: height
        });
        this.PixiApp.stage.addChild(this.SceneContainer);
    }
}