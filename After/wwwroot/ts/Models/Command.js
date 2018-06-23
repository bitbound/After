var After;
(function (After) {
    var Models;
    (function (Models) {
        class Command {
            constructor() {
            }
            GetHelpTitle() {
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
        Models.Command = Command;
    })(Models = After.Models || (After.Models = {}));
})(After || (After = {}));
//# sourceMappingURL=Command.js.map