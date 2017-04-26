namespace After.Models.App {
    export class Utilities {
        NumberIsBetween(NumberAnalyzed, Min, Max, IncludeMinMax) {
            if (IncludeMinMax) {
                if (NumberAnalyzed == Min || NumberAnalyzed == Max) {
                    return true;
                }
            }
            if (NumberAnalyzed > Min && NumberAnalyzed < Max) {
                return true;
            }
            else {
                return false;
            }
        };
        GetRandom(Min:number, Max:number, Round:boolean): number {
            if (Min > Max) {
                throw "Min must be less than max.";
            }
            var ran = Math.random();
            var diff = Max - Min;
            var result = ran * diff;
            if (Round) {
                return Math.round(result + Min);
            }
            else {
                return result + Min;
            }
        };
        Delay(ms: number) {
             return new Promise(resolve => setTimeout(resolve, ms));
        };
        get ColorNames() { return ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenrod", "DarkGray", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "DarkOrange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "Goldenrod", "Gray", "Green", "GreenYellow", "Honeydew", "HotPink", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenrodYellow", "LightGreen", "LightGrey", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquamarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenrod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "Seashell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"] };
        ColorNameToHex(colour:string):string {
            var colours = {
                "aliceblue": "#f0f8ff",
                "antiquewhite": "#faebd7",
                "aqua": "#00ffff",
                "aquamarine": "#7fffd4",
                "azure": "#f0ffff",
                "beige": "#f5f5dc",
                "bisque": "#ffe4c4",
                "blanchedalmond": "#ffebcd",
                "blue": "#0000ff",
                "blueviolet": "#8a2be2",
                "brown": "#a52a2a",
                "burlywood": "#deb887",
                "cadetblue": "#5f9ea0",
                "chartreuse": "#7fff00",
                "chocolate": "#d2691e",
                "coral": "#ff7f50",
                "cornflowerblue": "#6495ed",
                "cornsilk": "#fff8dc",
                "crimson": "#dc143c",
                "cyan": "#00ffff",
                "darkblue": "#00008b",
                "darkcyan": "#008b8b",
                "darkgoldenrod": "#b8860b",
                "darkgray": "#a9a9a9",
                "darkgreen": "#006400",
                "darkkhaki": "#bdb76b",
                "darkmagenta": "#8b008b",
                "darkolivegreen": "#556b2f",
                "darkorange": "#ff8c00",
                "darkorchid": "#9932cc",
                "darkred": "#8b0000",
                "darksalmon": "#e9967a",
                "darkseagreen": "#8fbc8f",
                "darkslateblue": "#483d8b",
                "darkslategray": "#2f4f4f",
                "darkturquoise": "#00ced1",
                "darkviolet": "#9400d3",
                "deeppink": "#ff1493",
                "deepskyblue": "#00bfff",
                "dimgray": "#696969",
                "dodgerblue": "#1e90ff",
                "firebrick": "#b22222",
                "floralwhite": "#fffaf0",
                "forestgreen": "#228b22",
                "fuchsia": "#ff00ff",
                "gainsboro": "#dcdcdc",
                "ghostwhite": "#f8f8ff",
                "gold": "#ffd700",
                "goldenrod": "#daa520",
                "gray": "#808080",
                "green": "#008000",
                "greenyellow": "#adff2f",
                "honeydew": "#f0fff0",
                "hotpink": "#ff69b4",
                "indianred ": "#cd5c5c",
                "indigo": "#4b0082",
                "ivory": "#fffff0",
                "khaki": "#f0e68c",
                "lavender": "#e6e6fa",
                "lavenderblush": "#fff0f5",
                "lawngreen": "#7cfc00",
                "lemonchiffon": "#fffacd",
                "lightblue": "#add8e6",
                "lightcoral": "#f08080",
                "lightcyan": "#e0ffff",
                "lightgoldenrodyellow": "#fafad2",
                "lightgrey": "#d3d3d3",
                "lightgreen": "#90ee90",
                "lightpink": "#ffb6c1",
                "lightsalmon": "#ffa07a",
                "lightseagreen": "#20b2aa",
                "lightskyblue": "#87cefa",
                "lightslategray": "#778899",
                "lightsteelblue": "#b0c4de",
                "lightyellow": "#ffffe0",
                "lime": "#00ff00",
                "limegreen": "#32cd32",
                "linen": "#faf0e6",
                "magenta": "#ff00ff",
                "maroon": "#800000",
                "mediumaquamarine": "#66cdaa",
                "mediumblue": "#0000cd",
                "mediumorchid": "#ba55d3",
                "mediumpurple": "#9370d8",
                "mediumseagreen": "#3cb371",
                "mediumslateblue": "#7b68ee",
                "mediumspringgreen": "#00fa9a",
                "mediumturquoise": "#48d1cc",
                "mediumvioletred": "#c71585",
                "midnightblue": "#191970",
                "mintcream": "#f5fffa",
                "mistyrose": "#ffe4e1",
                "moccasin": "#ffe4b5",
                "navajowhite": "#ffdead",
                "navy": "#000080",
                "oldlace": "#fdf5e6",
                "olive": "#808000",
                "olivedrab": "#6b8e23",
                "orange": "#ffa500",
                "orangered": "#ff4500",
                "orchid": "#da70d6",
                "palegoldenrod": "#eee8aa",
                "palegreen": "#98fb98",
                "paleturquoise": "#afeeee",
                "palevioletred": "#d87093",
                "papayawhip": "#ffefd5",
                "peachpuff": "#ffdab9",
                "peru": "#cd853f",
                "pink": "#ffc0cb",
                "plum": "#dda0dd",
                "powderblue": "#b0e0e6",
                "purple": "#800080",
                "red": "#ff0000",
                "rosybrown": "#bc8f8f",
                "royalblue": "#4169e1",
                "saddlebrown": "#8b4513",
                "salmon": "#fa8072",
                "sandybrown": "#f4a460",
                "seagreen": "#2e8b57",
                "seashell": "#fff5ee",
                "sienna": "#a0522d",
                "silver": "#c0c0c0",
                "skyblue": "#87ceeb",
                "slateblue": "#6a5acd",
                "slategray": "#708090",
                "snow": "#fffafa",
                "springgreen": "#00ff7f",
                "steelblue": "#4682b4",
                "tan": "#d2b48c",
                "teal": "#008080",
                "thistle": "#d8bfd8",
                "tomato": "#ff6347",
                "turquoise": "#40e0d0",
                "violet": "#ee82ee",
                "wheat": "#f5deb3",
                "white": "#ffffff",
                "whitesmoke": "#f5f5f5",
                "yellow": "#ffff00",
                "yellowgreen": "#9acd32"
            };

            if (typeof colours[colour.toLowerCase()] != 'undefined') {
                return colours[colour.toLowerCase()];
            }

            return "";
        };
        HexToRGB(col:string):string {
            var r, g, b;
            if (col.charAt(0) == '#') {
                col = col.substr(1);
            }
            r = col.charAt(0) + col.charAt(1);
            g = col.charAt(2) + col.charAt(3);
            b = col.charAt(4) + col.charAt(5);
            r = parseInt(r, 16);
            g = parseInt(g, 16);
            b = parseInt(b, 16);
            return 'rgb(' + r + ',' + g + ',' + b + ')';
        };
        ShowDialog(Message:string, TextColor:string, ButtonText:string, ButtonAction: ()=>void) {
            var divOuter = document.createElement("div");
            var divMessage = document.createElement("div");
            var buttonAction = document.createElement("button");
            divMessage.innerHTML = Message;
            buttonAction.innerHTML = ButtonText;
            buttonAction.type = "button";
            buttonAction.removeAttribute("style");
            buttonAction.style.setProperty("float", "right");
            buttonAction.style.setProperty("margin-top", "20px");
            buttonAction.onclick = function () {
                if (ButtonAction) {
                    ButtonAction();
                }
                $(divOuter).remove();
            };
            $(divOuter).css({
                "position": "absolute",
                "padding": "20px",
                "font-weight": "bold",
                "background-color": "lightgray",
                "color": TextColor,
                "border-radius": "10px",
                "border": "2px solid dimgray",
                "top": "50%",
                "left": "50%",
                "transform": "translate(-50%, -50%)",
                "z-index": "4",
                "box-shadow": "10px 10px 5px rgba(255,255,255,.15)"
            });
            divOuter.appendChild(divMessage);
            divOuter.appendChild(buttonAction);
            $(document.body).append(divOuter);
        };
        ShowLoading() {
            var frame = document.createElement("div");
            frame.classList.add("loading-frame");
            frame.id = "divLoadingFrame";
            for (var i = 0; i < 10; i++) {
                var track = document.createElement("div");
                track.classList.add("loading-track");
                var dot = document.createElement("div");
                dot.classList.add("loading-dot");
                track.style.transform = "rotate(" + String(i * 36) + "deg)";
                track.appendChild(dot);
                frame.appendChild(track);
            }
            document.body.appendChild(frame);
            var wait = 0;
            $(frame).find(".loading-dot").each(function (index, elem) {
                window.setTimeout(function () {
                    elem.classList.add("loading-dot-animated");
                }, wait);
                wait += 150;
            });
        };
        RemoveLoading() {
            $("#divLoadingFrame").remove();
        };
        Animate(Object: any, Property: string, FromValue: number, ToValue: number, MsTransition: number) {
            if (typeof Object[Property] != "number") {
                console.log("Property is not of type number.");
                return;
            }
            var totalChange = ToValue - FromValue;
            for (var i = 0; i < MsTransition; i = i + 20)
            {
                window.setTimeout(function (currentTime) {
                    Object[Property] = FromValue + (currentTime / MsTransition * totalChange);
                    if (currentTime >= MsTransition) {
                        Object[Property] = ToValue;
                    }
                }, i, i)
            }
        }
    }
}