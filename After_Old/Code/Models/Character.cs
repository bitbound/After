using After.Dependencies;
using After.Dependencies.StorageLists;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace After.Data
{
    public class Character : IStorageItem
    {
        public Character()
        {
            CoreEnergy = 100;
            CoreEnergyPeak = 100;
            CurrentEnergy = 100;
            CurrentCharge = 0;
            CurrentWillpower = 100;
        }
        public string Type { get; set; }
        public string DisplayName { get; set; }
        public string StorageID { get; set; }
        public string Color { get; set; } = "gray";
        public string PortraitUri { get; set; }
        public double CoreEnergyPeak { get; set; }
        private double coreEnergy;
        public double CoreEnergy
        {
            get
            {
                return coreEnergy;
            }
            set
            {
                coreEnergy = value;
                if (value > CoreEnergyPeak)
                {
                    CoreEnergyPeak = value;
                }
            }
        }
        public double MaxEnergyModifier { get; set; }
        public double MaxEnergy
        {
            get
            {
                return CoreEnergy + MaxEnergyModifier;
            }
        }
        public double CurrentEnergy { get; set; }
        public double EnergyPercent
        {
            get
            {
                return CurrentEnergy / MaxEnergy;
            }
        }
        public double MaxChargeModifier { get; set; }
        public double MaxCharge
        {
            get
            {
                return CoreEnergy + MaxChargeModifier;
            }
        }
        public double CurrentCharge { get; set; }
        public double ChargePercent
        {
            get
            {
                return CurrentCharge / MaxCharge;
            }
        }
        public double MaxWillpowerModifier { get; set; }
        public double MaxWillpower
        {
            get
            {
                return CoreEnergy + MaxWillpowerModifier;
            }
        }
        public double CurrentWillpower { get; set; }
        public double WillpowerPercent
        {
            get
            {
                return CurrentWillpower / MaxWillpower;
            }
        }
        public string CurrentLocation { get; set; }
        public string PreviousLocation { get; set; }
        public List<string> RemotelyViewingLocations { get; set; } = new List<string>();
       
        public bool IsCharging { get; set; }

        public List<Power> Powers { get; set; } = new List<Power>();

        public MovementStates MovementState { get; set; }

        public enum MovementStates
        {
            Ready,
            Moving,
            Combat,
            Dialog
        }
        public Dictionary<string, string> Flags { get; set; }
        public Dictionary<string, System.Timers.Timer> Timers { get; set; } = new Dictionary<string, System.Timers.Timer>();
        public DateTime LastAccessed { get; set; }

        //*** Utility Methods ***//
        public Location GetCurrentLocation()
        {
            return Storage.Locations.Find(CurrentLocation);
        }
        public Location GetPreviousLocation()
        {
            return Storage.Locations.Find(PreviousLocation);
        }
        public List<Location> GetVisibleLocations()
        {
            List<Location> visibleList = new List<Location>();
            if (Storage.Locations.Exists(CurrentLocation))
            {
                visibleList.Add(Storage.Locations.Find(CurrentLocation));
            }

            foreach (var remoteLocation in RemotelyViewingLocations)
            {
                if (Storage.Locations.Exists(remoteLocation))
                {
                    visibleList.Add(Storage.Locations.Find(remoteLocation));
                }
            }
            return visibleList;
        }
        public async Task StartCharging()
        {
            if (this is Player)
            {
                var request = new
                {
                    Category = "Events",
                    Type = "StartCharging",
                    Result = "ok"

                };
                await (this as Player).GetSocketClient().SendString(JSON.Encode(request));
            }
            IsCharging = true;
            if (Timers.ContainsKey("ChargeTimer"))
            {
                Timers["ChargeTimer"].Close();
                Timers["ChargeTimer"].Dispose();
                Timers.Remove("ChargeTimer");
            }
            var timer = new System.Timers.Timer(100);
            var startTime = DateTime.Now;
            var startValue = CurrentCharge;
            timer.Elapsed += (sen, arg) => {
                if (IsCharging == false)
                {
                    (sen as System.Timers.Timer).Stop();
                    (sen as System.Timers.Timer).Dispose();
                    Timers.Remove("ChargeTimer");
                    return;
                }
                
                if (this is Player)
                {
                    var socket = (this as Player).GetSocketClient();
                    if (socket == null)
                    {
                        (sen as System.Timers.Timer).Stop();
                        (sen as System.Timers.Timer).Dispose();
                        Timers.Remove("ChargeTimer");
                        return;
                    }
                    CurrentCharge = Math.Min(MaxCharge, Math.Round(startValue + (DateTime.Now - startTime).TotalMilliseconds / 100 * .01 * MaxCharge));
                    dynamic update = new
                    {
                        Category = "Queries",
                        Type = "StatUpdate",
                        Stat = "CurrentCharge",
                        Amount = CurrentCharge
                    };
                    socket.SendString(JSON.Encode(update));
                }
                foreach (var occupant in Storage.Locations.Find(CurrentLocation).Occupants.Where(x=>x.OccupantType == OccupantTypes.Player))
                {
                    dynamic request = new
                    {
                        Category = "Events",
                        Type = "CharacterCharging",
                        Location = CurrentLocation
                    };
                    Storage.Players.Find(occupant.StorageID).GetSocketClient().SendString(JSON.Encode(request));
                }
            };
            Timers.Add("ChargeTimer", timer);
            timer.Start();
        }
        public async Task StopCharging()
        {
            if (this is Player)
            {
                var request = new
                {
                    Category = "Events",
                    Type = "StopCharging",
                    Result = "ok"

                };
                await (this as Player).GetSocketClient().SendString(JSON.Encode(request));
            }
            if (Timers.ContainsKey("ChargeTimer"))
            {
                Timers["ChargeTimer"].Close();
                Timers["ChargeTimer"].Dispose();
                Timers.Remove("ChargeTimer");
            }
            IsCharging = false;
            var timer = new System.Timers.Timer(100);
            var startTime = DateTime.Now;
            var startValue = CurrentCharge;
            timer.Elapsed += (sen, arg) => {
                if (IsCharging == true || CurrentCharge == 0)
                {
                    (sen as System.Timers.Timer).Stop();
                    (sen as System.Timers.Timer).Dispose();
                    Timers.Remove("ChargeTimer");
                    return;
                }
                if (this is Player)
                {
                    var handler = (this as Player).GetSocketClient();
                    if (handler == null)
                    {
                        (sen as System.Timers.Timer).Stop();
                        (sen as System.Timers.Timer).Dispose();
                        Timers.Remove("ChargeTimer");
                        return;
                    }
                    CurrentCharge = Math.Max(0, Math.Round(startValue - (DateTime.Now - startTime).TotalMilliseconds / 100 * .01 * MaxCharge));
                    dynamic update = new
                    {
                        Category = "Queries",
                        Type = "StatUpdate",
                        Stat = "CurrentCharge",
                        Amount = CurrentCharge
                    };
                    (this as Player).GetSocketClient().SendString(JSON.Encode(update));
                }
            };
            Timers.Add("ChargeTimer", timer);
            timer.Start();
        }
        public dynamic ConvertToSoul()
        {
            return new
            {
                Name = this.DisplayName,
                Color = this.Color,
                Location = CurrentLocation,
                CurrentLocation = this.CurrentLocation
            };
        }
    }
}
