<%@ Application Language="C#" %>

<script runat="server">

    void Application_Start(object sender, EventArgs e)
    {
        // Code that runs on application startup
        After.Utilities.StartUp();
    }

    void Application_End(object sender, EventArgs e)
    {
        //  Code that runs on application shutdown
        After.Storage.Current.Locations.StoreAll();
        After.Storage.Current.Players.StoreAll();
        After.Storage.Current.NPCs.StoreAll();
        After.Storage.Current.Messages.StoreAll();
    }

    void Application_Error(object sender, EventArgs e)
    {
        // Code that runs when an unhandled error occurs
        var exError = Server.GetLastError();
        After.Utilities.WriteError(exError);
    }

    void Session_Start(object sender, EventArgs e)
    {
        // Code that runs when a new session is started

    }

    void Session_End(object sender, EventArgs e)
    {
        // Code that runs when a session ends. 
        // Note: The Session_End event is raised only when the sessionstate mode
        // is set to InProc in the Web.config file. If session mode is set to StateServer 
        // or SQLServer, the event is not raised.

    }
    void Application_BeginRequest(object sender, EventArgs e)
    {

    }
</script>
