using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Web;
using System.Web.Helpers;
using System.Web.Script.Serialization;

/// <summary>
/// Summary description for Utilities
/// </summary>

namespace After
{
    public static class Utilities
    {
        public static dynamic Clone(dynamic JsonData)
        {
            var strData = Json.Encode(JsonData);
            return Json.Decode(strData);
        }

        public static string App_Data
        {
            get
            {
                return HttpContext.Current.Server.MapPath("~/App_Data/");
            }
        }
    }
}
