import { Main } from "../Main.js";

export class GameObject {
  
    public ID: string;
    public Height: number;
    public Width: number;
    public XCoord: number;
    public YCoord: number;
    public ZCoord: string;
    public VelocityX: number;
    public VelocityY: number;
    public MaxVelocity: number;
    public AccelerationSpeed: number;
    public DecelerationSpeed: number;
    public Color: string;
    public Discriminator: string;
    public get Rect(): PIXI.Rectangle {
        return new PIXI.Rectangle(this.XCoord, this.YCoord, this.Width, this.Height);
    }
    public CreateGraphics() {
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
