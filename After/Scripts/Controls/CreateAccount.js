After.Temp.Login = After.Temp.Login || {};
After.Temp.Login.Create = function () {
    var strUsername = $("#inputNewUsername").val();
    var strPassword = $("#inputNewPassword").val();
    var strConfirmPassword = $("#inputConfirmPassword").val();
    var regex = new RegExp("[^a-z,A-Z,0-9,_,-]").test(strUsername);
    var regex2 = new RegExp("--").test(strUsername);
    var regex3 = new RegExp("__").test(strUsername);
    if ($.isEmptyObject(strUsername)) {
        $("#divCreateAccountStatus").text("You must enter a username.");
        return;
    };
    if ($.isEmptyObject(strPassword)) {
        $("#divCreateAccountStatus").text("You must enter a password.");
        return;
    };
    if ($.isEmptyObject(strConfirmPassword)) {
        $("#divCreateAccountStatus").text("You must confirm your password.");
        return;
    };
    if (regex) {
        $("#divCreateAccountStatus").text("Your username can only contain alphanumeric characters, hyphens, and underscores.");
        return;
    };
    if (regex2 || regex3) {
        $("#divCreateAccountStatus").text("Your username cannot contain consecutive underscores or hyphens.");
        return;
    };
    if (strPassword != strConfirmPassword) {
        $("#divCreateAccountStatus").text("The two password entries do not match.");
        return;
    };
    if (strUsername.length > 25 || strPassword > 25) {
        $("#divCreateAccountStatus").text("Usernames and passwords can only be a max of 25 characters.");
        return;
    };
    var creationRequest = {
        "Category": "Accounts",
        "Type": "AccountCreation",
        "Username": strUsername,
        "Password": strPassword,
        "Color": After.Me.Color
    };
    sessionStorage["Username"] = strUsername;
    After.Connection.Socket.send(JSON.stringify(creationRequest));
};