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
        After.World.Current.Locations.StoreAll();
        After.World.Current.Players.StoreAll();
        After.World.Current.NPCs.StoreAll();
        After.World.Current.Messages.StoreAll();
    }

    void Application_Error(object sender, EventArgs e)
    {
        // Code that runs when an unhandled error occurs

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
        if (!Request.IsLocal && !Request.IsSecureConnection)
        {
            Response.RedirectPermanent(Request.Url.AbsoluteUri.ToLower().Replace("http://", "https://"), true);
            return;
        }
    }
</script>
