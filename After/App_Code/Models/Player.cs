using System;
using System.Collections.Generic;
using System.Drawing;

namespace After.Models
{
    public class Player: Character
    {
        public Player()
        {
            CoreEnergy = 100;
            CurrentEnergy = 100;
            CurrentCharge = 0;
            CurrentWillpower = 100;
            FlagList.Add(PlayerFlags.NewCharacter);
            FlagList.Add(PlayerFlags.IntroIncomplete);
            FlagList.Add(PlayerFlags.IntroStage1);
        }
        public string Password { get; set; }
        public bool IsAdmin { get; set; }

        public bool AdminFlagged { get; set; }

        public bool Kicked { get; set; }
        public bool Banned { get; set; }

        public Guid LastGameIDPlayed { get; set; }
        public int BadPasswordCount { get; set; } = 0;
        public bool LockedOut { get; set; }
        public DateTime LockoutTime { get; set; }
        public AccountTypes AccountType { get; set; }

        public string LastIP { get; set; }

        public enum AccountTypes
        {
            Standard,
            Subscriber,
            Transcendent,
            Admin,
        }

        public List<PlayerFlags> FlagList { get; set; } = new List<PlayerFlags>();

        public enum PlayerFlags
        {
            NewCharacter,
            IntroIncomplete,
            IntroStage1,
        }
        public override string ToString()
        {
            return Name;
        }
    }
}