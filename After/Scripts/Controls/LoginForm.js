After.Temp.Login = After.Temp.Login || {};
After.Temp.Login.Init = function () {
    $.get("/Controls/LoginForm.html", function (data) {
        $(document.body).append(data);
        if (localStorage["RememberMe"] == "true" && typeof localStorage["AuthenticationToken"] != "undefined") {
            $("#checkRememberMe")[0].checked = true;
            $("#inputUsername").val(localStorage["Username"]);
            $("#inputPassword").val("**********");
        }
        $("#inputPassword").on("input", function () {
            localStorage.removeItem("AuthenticationToken");
        })
    });
    After.Temp.Login.TryLogin = function () {
        if (After.Connection.Socket.readyState != WebSocket.OPEN) {
            alert("Could not connect to the server.  Make sure your browser supports WebSockets.");
            return;
        };
        var strUsername = $("#inputUsername").val();
        var strPassword = $("#inputPassword").val();
        if (strUsername == "") {
            $("#divLoginStatus").hide();
            $("#divLoginStatus").text("You must specify a username.");
            $("#divLoginStatus").fadeIn();
            return;
        };
        if (strPassword == "") {
            $("#divLoginStatus").hide();
            $("#divLoginStatus").text("You must specify a password.");
            $("#divLoginStatus").fadeIn();
            return;
        };
        $("#buttonLogin").attr("disabled", true);
        var logonRequest = {
            "Category": "Accounts",
            "Type": "Logon",
            "Username": strUsername,
            "Password": strPassword
        };
        After.Me.Name = logonRequest.Username;
        if (localStorage["RememberMe"] == "true") {
            localStorage["Username"] = $("#inputUsername").val();
            logonRequest.AuthenticationToken = localStorage["AuthenticationToken"];
        }
        else
        {
            localStorage.removeItem("Username");
            localStorage.removeItem("AuthenticationToken");
        }
        After.Connection.Socket.send(JSON.stringify(logonRequest));
    };
    After.Temp.Login.StartIntro = function () {
        After.Temp.Intro.Start();
    };
    After.Temp.Login.RememberMeChanged = function (e) {
        localStorage.setItem("RememberMe", String(e.currentTarget.checked));
        if (e.currentTarget.checked == false) {
            $("#inputPassword").val("");
        }
    };
    After.Temp.Login.ForgotPasswordClicked = function () {
        // TODO.
    }
};