using System;
using System.Collections.Generic;
using Translucency.WebSockets;

namespace After.Models
{
    public class Player: Character
    {
        public Player()
        {
           
        }
        public string Password { get; set; }
        public string TemporaryPassword { get; set; }
        public string Email { get; set; }
        public List<string> AuthenticationTokens { get; set; } = new List<string>();
        public Settings Settings { get; set; } = new Settings();

        public bool Kicked { get; set; }
        public bool Banned { get; set; }
        public int BadLoginAttempts { get; set; } = 0;
        public DateTime LastBadLogin { get; set; }
        
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
            return Utilities.Server.ClientList.Exists(client => client.Tags?["Player"]?.Name == Name);
        }
        public WebSocketClient GetSocketHandler()
        {
            return Utilities.Server.ClientList.Find(client => client.Tags?["Player"]?.Name == Name);
        }
        public dynamic ConvertToMe()
        {
            var location = CurrentXYZ.Split(',');
            return new
            {
                Name = this.Name,
                Color = this.Color,
                XCoord = location[0],
                YCoord = location[1],
                ZCoord = location[2],
                CurrentXYZ = this.CurrentXYZ,
                CoreEnergy = this.CoreEnergy,
                CoreEnergyPeak = this.CoreEnergyPeak,
                CurrentEnergy = this.CurrentEnergy,
                MaxEnergy = this.MaxEnergy,
                MaxEnergyModifier = this.MaxEnergyModifier,
                CurrentCharge = this.CurrentCharge,
                MaxCharge = this.MaxCharge,
                MaxChargeModifier = this.MaxChargeModifier,
                CurrentWillpower = this.CurrentWillpower,
                MaxWillpower = this.MaxWillpower,
                MaxWillpowerModifier = this.MaxWillpowerModifier,
                ViewDistance = this.ViewDistance
            };
        }
    }
}