class WebSockets {
    Connection: any;
    Connect() {
        console.log("Establishing connection...");
        var signalR = window["signalR"];
        this.Connection = new signalR.HubConnectionBuilder()
            .withUrl("/SocketEndpoint")
            .configureLogging(signalR.LogLevel.Information)
            .build();

        applyMessageHandlers(this.Connection);

        this.Connection.start().catch(err => {
            console.error(err.toString());
            console.log("Connection closed.");
        });
    }
}

function applyMessageHandlers(hubConnection: any) {
    hubConnection.on("Connected", (args) => {
        console.log("Connected.");
    });
}
export default new WebSockets();