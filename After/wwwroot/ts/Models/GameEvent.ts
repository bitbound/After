export class GameEvent {
    EventName: string;
    XCoord: number;
    YCoord: number;
    ZCoord: string;
    EventData: Array<{EventName:string, EventData:any}>;
}