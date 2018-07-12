export class GameObject {
    public ID: number;
    public Height: number;
    public Width: number;
    public XCoord: number;
    public YCoord: number;
    public ZCoord: string;
    public VelocityX: number;
    public VelocityY: number;
    public AccelerationSpeed: number;
    public DecelerationSpeed: number;
    //public get Rect(): Rectangle {
    //    return new Rectangle(<number>this.XCoord, <number>this.YCoord, this.Width, this.Height);
    //}
}