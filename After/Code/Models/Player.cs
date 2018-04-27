using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using After.Dependencies.WebSockets;

namespace After.Models
{
    public class Player: Character
    {
        public string Password { get; set; }
        public string TemporaryPassword { get; set; }
        public string Email { get; set; }
        public List<string> AuthenticationTokens { get; set; } = new List<string>();
        public Settings Settings { get; set; } = new Settings();

        public bool Kicked { get; set; }
        public bool IsBanned { get; set; }
        public bool IsWarned { get; set; }
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
            return App.Server.ClientList.Exists(client => client?.Player?.Name == Name);
        }
        public WebSocketClient GetSocketHandler()
        {
            return App.Server.ClientList.Find(client => client?.Player?.Name == Name);
        }
        public async Task WarnOrBan(WebSocketClient WSC)
        {
            if (IsWarned)
            {
                IsBanned = true;
                var request = new
                {
                    Category = "Accounts",
                    Type = "Banned"
                };
                await WSC.SendJSON(request);
                if (AccountType == AccountTypes.Admin)
                {
                    IsWarned = false;
                    IsBanned = false;
                }
                await WSC.ClientSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Banned.", CancellationToken.None);
                WSC.ClientSocket.Dispose();
                return;
            }
            else
            {
                IsWarned = true;
                var request = new
                {
                    Category = "Accounts",
                    Type = "Warned"
                };
                await WSC.SendJSON(request);
                await WSC.ClientSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Warned.", CancellationToken.None);
                WSC.ClientSocket.Dispose();
                return;
            }
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