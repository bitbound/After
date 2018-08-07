import { GameObject } from "./GameObject.js";
import { Main } from "../Main.js";
export class Projectile extends GameObject {
    CreateGraphics() {
        var projectile = new PIXI.Graphics();
        projectile.width = 5;
        projectile.height = 5;
        projectile.beginFill(PIXI.utils.rgb2hex([1, 1, 1]), 1);
        projectile.drawCircle(0, 0, 5);
        projectile.endFill();
        projectile.x = Main.Renderer.PixiApp.screen.width / 2;
        projectile.y = Main.Renderer.PixiApp.screen.height / 2;
        projectile.name = this.ID;
        Main.Renderer.SceneContainer.addChild(projectile);
        this.PixiGraphics = projectile;
    }
}
//# sourceMappingURL=Projectile.js.map