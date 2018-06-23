namespace After.Models {
    export class Command {
        constructor() {
        }
        Name: string;
        Category: string;
        HelpText: string;

        GetHelpTitle(): string {
            var titleString = `<br/><div style="display:inline-block; text-align:center; color: steelblue;">`;
            for (var i = 0; i < this.Name.length + 15; i++) {
                titleString += "#";
            }
            titleString += "<br/>Command: " + this.Name + "<br/>";
            for (var i = 0; i < this.Name.length + 15; i++) {
                titleString += "#";
            }
            titleString += "</div><br><br>";
            titleString += this.HelpText + "<br><br>";
            return titleString;
        }
    }
}