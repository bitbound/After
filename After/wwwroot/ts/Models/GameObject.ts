export class GameObject {
    public ID: string;
    public Height: number;
    public Width: number;
    public XCoord: number;
    public YCoord: number;
    public ZCoord: string;
    public VelocityX: number;
    public VelocityY: number;
    public AccelerationSpeed: number;
    public DecelerationSpeed: number;
    public Discriminator: string;
    public get Rect(): PIXI.Rectangle {
        return new PIXI.Rectangle(this.XCoord, this.YCoord, this.Width, this.Height);
    }
}