import { Main } from "../Main.js";
import { UI } from "./UI.js";

export const Settings = new class {
    get ShowDebug(): boolean {
        return UI.DeubgWindow.hidden;
        //return Main.Renderer.stage.getChildByName("Debug") != null;
    }
    set ShowDebug(value: boolean) {
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

    private touchscreen: boolean;
    get Touchscreen(): boolean {
        return this.touchscreen;
    }
    set Touchscreen(value: boolean) {
        this.touchscreen = value;
    }
}