import { Settings } from "./Settings.js";

export const Renderer = new class {
    PixiApp: PIXI.Application;
    SceneContainer: PIXI.Container = new PIXI.Container();
    CreatePixiApp(width: number, height: number) {
        this.PixiApp = new PIXI.Application({
            view: document.querySelector("#playCanvas"),
            width: width,
            height: height
        });
        this.PixiApp.stage.addChild(this.SceneContainer);
    }
}