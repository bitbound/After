import { UI } from "./UI.js";
export const Settings = new class {
    get ShowDebug() {
        return UI.DeubgWindow.hidden;
        //return Main.Renderer.stage.getChildByName("Debug") != null;
    }
    set ShowDebug(value) {
        UI.DeubgWindow.hidden = value;
        //var debug = Main.Renderer.stage.getChildByName("Debug") as PIXI.Text;
        //if (debug == null) {
        //    debug = new PIXI.Text(
        //        `FPS: ${Main.Renderer.ticker.FPS.toString()}`,
        //        new PIXI.TextStyle({
        //            fill: "white",
        //            fontSize: "14px"
        //        })
        //    );
        //    debug.x = Main.Renderer.screen.width - (debug.width + 10);
        //    debug.y = 10;
        //    debug.name = "Debug";
        //    Main.Renderer.stage.addChild(debug);
        //}
        //debug.renderable = value;
    }
    get Touchscreen() {
        return this.touchscreen;
    }
    set Touchscreen(value) {
        this.touchscreen = value;
    }
};
//# sourceMappingURL=Settings.js.map