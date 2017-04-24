<%@ Application Language="C#" %>

<script runat="server">

    void Application_Start(object sender, EventArgs e)
    {
        // Code that runs on application startup
        using (var world = new After.Models.World())
        {
            if (!world.Locations.Any(l => l.LocationID == "0,0,0"))
            {
                world.Locations.Add(new After.Models.Location()
                {
                    XCoord = 0,
                    YCoord = 0,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                world.Locations.Add(new After.Models.Location()
                {
                    XCoord = -2,
                    YCoord = 0,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"

                });
                world.Locations.Add(new After.Models.Location()
                {
                    XCoord = -1,
                    YCoord = 0,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                world.Locations.Add(new After.Models.Location()
                {
                    XCoord = 1,
                    YCoord = 0,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                world.Locations.Add(new After.Models.Location()
                {
                    XCoord = 2,
                    YCoord = 0,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                world.Locations.Add(new After.Models.Location()
                {
                    XCoord = -1,
                    YCoord = -1,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                world.Locations.Add(new After.Models.Location()
                {
                    XCoord = 1,
                    YCoord = -1,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                world.Locations.Add(new After.Models.Location()
                {
                    XCoord = 0,
                    YCoord = -2,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                world.Locations.Add(new After.Models.Location()
                {
                    XCoord = -3,
                    YCoord = 1,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                world.Locations.Add(new After.Models.Location()
                {
                    XCoord = -4,
                    YCoord = 2,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                world.Locations.Add(new After.Models.Location()
                {
                    XCoord = 3,
                    YCoord = 1,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                world.Locations.Add(new After.Models.Location()
                {
                    XCoord = 4,
                    YCoord = 2,
                    ZCoord = "0",
                    IsStatic = true,
                    Title = "After Commons",
                    Description = "This is the center of nothing and the start of everything.",
                    Color = "lightsteelblue"
                });
                world.SaveChanges();
            }
        }
    }

    void Application_End(object sender, EventArgs e)
    {
        //  Code that runs on application shutdown
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
