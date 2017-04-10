using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;

namespace After.Models
{
    public class Player: Character
    {
        public Player()
        {
           
        }
        public string Password { get; set; }
        public bool IsAdmin { get; set; }

        public bool AdminFlagged { get; set; }

        public bool Kicked { get; set; }
        public bool Banned { get; set; }
        public int BadPasswordCount { get; set; } = 0;
        public bool LockedOut { get; set; }
        public DateTime? LockoutTime { get; set; }
        public AccountTypes AccountType { get; set; }

        public string LastIP { get; set; }

        public enum AccountTypes
        {
            Standard,
            Subscriber,
            Creator,
            Admin,
        }

        public override string ToString()
        {
            return Name;
        }

        public bool IsLoggedIn()
        {
            return Socket_Handler.SocketCollection.Any(sh => (sh as Socket_Handler)?.Player?.Name == Name);
        }
    }
}