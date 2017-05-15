using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace After.App_Code.Models
{
    public class Script
    {
        public string ScriptText { get; set; }
        public Triggers Trigger { get; set; }
        public enum Triggers
        {
            OnEnter,
            OnTalk,
            OnView,
        }
    }
}