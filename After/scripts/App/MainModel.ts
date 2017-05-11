namespace After {
    export const Debug = false;
    export const Temp = <any>{};
    export const Audio = new After.App.Audio();
    export const Canvas = new After.App.Canvas();
    export const Connection = new After.App.Connection();
    export const Drawing = new After.App.Drawing();
    export const Game = new After.App.Game();
    export const Me = new After.App.Me();
    export const Settings = new After.App.Settings();
    export const Utilities = new After.App.Utilities();
}

namespace After.World_Data {
    export const Areas = new Array<After.Models.Area>();
    export const Souls = new Array<After.Models.Soul>();
    export const FreeParticles = new Array<After.Models.FreeParticle>();
    export const Landmarks = new Array<After.Models.Landmark>();
}