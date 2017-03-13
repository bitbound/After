After.Temp.Login = After.Temp.Login || {};
After.Temp.Login.Init = function () {
    $.get("/Controls/LoginForm.html", function (data) { $(document.body).append(data); });
    After.Connection.Init();
    After.Temp.Login.TryLogin = function () {
        if (After.Connection.Socket.readyState != WebSocket.OPEN) {
            alert("Could not connect to the server.  Make sure your browser supports WebSockets.");
            return;
        };
        var strUsername = $("#inputUsername").val();
        var strPassword = $("#inputPassword").val();
        if (strUsername == "") {
            alert("You must specify a username.");
            return;
        };
        if (strPassword == "") {
            alert("You must specify a password.");
            return;
        };
        $("#buttonLogin").attr("disabled", true);
        var logonRequest = { Type: "Logon", Username: strUsername, Password: strPassword };
        sessionStorage["Username"] = logonRequest.Username;
        After.Connection.Socket.send(JSON.stringify(logonRequest));
    };
    After.Temp.Login.StartIntro = function () {
        After.Temp.Intro.Start();
    };
};