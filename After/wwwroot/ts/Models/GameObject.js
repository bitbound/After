import { Main } from "../Main.js";
export class GameObject {
    get Rect() {
        return new PIXI.Rectangle(this.XCoord, this.YCoord, this.Width, this.Height);
    }
    CreateGraphics() {
        var genericObject = new PIXI.Graphics();
        genericObject.width = 5;
        genericObject.height = 5;
        genericObject.beginFill(PIXI.utils.rgb2hex([1, 1, 1]), 1);
        genericObject.drawRect(0, 0, 5, 5);
        genericObject.endFill();
        genericObject.x = Main.Renderer.PixiApp.screen.width / 2;
        genericObject.y = Main.Renderer.PixiApp.screen.height / 2;
        genericObject.name = this.ID;
        Main.Renderer.SceneContainer.addChild(genericObject);
    }
}
//# sourceMappingURL=GameObject.js.map