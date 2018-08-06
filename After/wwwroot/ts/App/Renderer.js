export const Renderer = new class {
    constructor() {
        this.SceneContainer = new PIXI.Container();
    }
    CreatePixiApp(width, height) {
        this.PixiApp = new PIXI.Application({
            view: document.querySelector("#playCanvas"),
            width: width,
            height: height
        });
        this.PixiApp.stage.addChild(this.SceneContainer);
    }
};
//# sourceMappingURL=Renderer.js.map