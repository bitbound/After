namespace After {
    export const Debug = false;
    export const Temp = <any>{};
    export const Audio = new After.Models.App.Audio();
    export const Canvas = new After.Models.App.Canvas();
    export const Connection = new After.Models.App.Connection();
    export const Drawing = new After.Models.App.Drawing();
    export const Game = new After.Models.App.Game();
    export const Me = new After.Models.App.Me();
    export const Settings = new After.Models.App.Settings();
    export const Utilities = new After.Models.App.Utilities();
}

namespace After.World_Data {
    export const Areas = new Array<After.Models.Game.Area>();
    export const Souls = new Array<After.Models.Game.Soul>();
}