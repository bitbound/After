using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using After.Dependencies.WebSockets;

namespace After.Data
{
    public class Player: Character
    {
        public string Password { get; set; }
        public string TemporaryPassword { get; set; }
        public string Email { get; set; }
        public List<string> AuthenticationTokens { get; set; } = new List<string>();
        public Settings Settings { get; set; } = new Settings();
        public string InnerVoidLocation { get; set; }

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
            return StorageID;
        }

        public bool IsLoggedIn()
        {
            return App.Server.ClientList.Exists(client => client?.Player?.StorageID == StorageID);
        }
        public WebSocketClient GetSocketClient()
        {
            return App.Server.ClientList.Find(client => client?.Player?.StorageID == StorageID);
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
            return new
            {
                this.DisplayName,
                this.Color,
                this.CurrentLocation,
                this.CoreEnergy,
                this.CoreEnergyPeak,
                this.CurrentEnergy,
                this.MaxEnergy,
                this.MaxEnergyModifier,
                this.CurrentCharge,
                this.MaxCharge,
                this.MaxChargeModifier,
                this.CurrentWillpower,
                this.MaxWillpower,
                this.MaxWillpowerModifier,
                this.Powers
            };
        }
    }
}