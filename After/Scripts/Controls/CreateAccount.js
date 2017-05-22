After.Temp = After.Temp || {};
After.Temp.Login = After.Temp.Login || {};
After.Temp.Login.Create = function () {
    var strUsername = $("#inputNewUsername").val();
    var strPassword = $("#inputCreateNewPassword").val();
    var strEmail = $("#inputEmail").val();
    var strConfirmPassword = $("#inputCreateConfirmPassword").val();
    var regex = new RegExp("[^a-z,A-Z,0-9,_,-]").test(strUsername);
    var regex2 = new RegExp("--").test(strUsername);
    var regex3 = new RegExp("__").test(strUsername);
    if ($.isEmptyObject(strUsername)) {
        $("#divCreateAccountStatus").hide();
        $("#divCreateAccountStatus").text("You must enter a username.");
        $("#divCreateAccountStatus").fadeIn();
        return;
    }
    ;
    if ($.isEmptyObject(strPassword)) {
        $("#divCreateAccountStatus").hide();
        $("#divCreateAccountStatus").text("You must enter a password.");
        $("#divCreateAccountStatus").fadeIn();
        return;
    }
    ;
    if ($.isEmptyObject(strConfirmPassword)) {
        $("#divCreateAccountStatus").hide();
        $("#divCreateAccountStatus").text("You must confirm your password.");
        $("#divCreateAccountStatus").fadeIn();
        return;
    }
    ;
    if (regex) {
        $("#divCreateAccountStatus").hide();
        $("#divCreateAccountStatus").text("Your username can only contain alphanumeric characters, hyphens, and underscores.");
        $("#divCreateAccountStatus").fadeIn();
        return;
    }
    ;
    if (regex2 || regex3) {
        $("#divCreateAccountStatus").hide();
        $("#divCreateAccountStatus").text("Your username cannot contain consecutive underscores or hyphens.");
        $("#divCreateAccountStatus").fadeIn();
        return;
    }
    ;
    if (strPassword != strConfirmPassword) {
        $("#divCreateAccountStatus").hide();
        $("#divCreateAccountStatus").text("The two password entries do not match.");
        $("#divCreateAccountStatus").fadeIn();
        return;
    }
    ;
    if (strUsername.length > 25 || strPassword > 25) {
        $("#divCreateAccountStatus").hide();
        $("#divCreateAccountStatus").text("Usernames and passwords can only be a max of 25 characters.");
        $("#divCreateAccountStatus").fadeIn();
        return;
    }
    ;
    var creationRequest = {
        "Category": "Accounts",
        "Type": "AccountCreation",
        "Username": strUsername,
        "Password": strPassword,
        "Color": After.Me.Color,
        "Email": strEmail
    };
    After.Me.Name = strUsername;
    After.Connection.Socket.send(JSON.stringify(creationRequest));
};
After.Temp.Login.ShowEmailHelp = function () {
    After.Utilities.ShowDialog("Your email would only be used for resetting your password.  Nothing else would ever be sent, and your email would never be shared.<br/><br/>If an email is not provided, you will not be able to recover your account if you forget your password.", "black", "OK", null);
};
