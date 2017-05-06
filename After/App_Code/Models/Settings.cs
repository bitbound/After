using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace After.Models
{
    public class Settings
    {
        public bool FollowPlayer { get; set; } = true;
        public bool DPad { get; set; } = true;
        public bool Joystick { get; set; } = false;
    }
}