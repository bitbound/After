using Dynamic_JSON;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace After.Models
{
    public class Character : StorageLists.IStorageItem
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
        public string StorageID { get; set; }
        public string DisplayName { get; set; }
        public string Name
        {
            get
            {
                if (this is Player)
                {
                    return StorageID;
                }
                else
                {
                    return DisplayName;
                }
            }
            set
            {
                if (this is Player)
                {
                    StorageID = value;
                }
                else
                {
                    DisplayName = value;
                }
            }
        }
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
        public string PreviousXYZ { get; set; }
        public string FutureXYZ { get; set; }
        public double? XCoord { get; set; }
        public double? YCoord { get; set; }
        public string ZCoord { get; set; }
        public string CurrentXYZ
        {
            get
            {
                if (XCoord == null || YCoord == null || ZCoord == null)
                {
                    return null;
                }
                return $"{XCoord},{YCoord},{ZCoord}";
            }
            set
            {
                if (value == null)
                {
                    XCoord = null;
                    YCoord = null;
                    return;
                }
                var locArray = value.Split(',');
                this.XCoord = double.Parse(locArray[0]);
                this.YCoord = double.Parse(locArray[1]);
                this.ZCoord = locArray[2];
            }
        }
        public double ViewDistance { get; set; } = 2;
       
        public bool IsCharging { get; set; }

        public List<Power> Powers { get; set; } = new List<Power>();

        public MovementStates MovementState { get; set; }

        public enum MovementStates
        {
            Ready,
            Teleporting,
            Moving,
            Traveling,
            Combat,
            Dialog
        }
        public Dictionary<string, string> Flags { get; set; }
        public Dictionary<string, System.Timers.Timer> Timers { get; set; } = new Dictionary<string, System.Timers.Timer>();
        public DateTime LastAccessed { get; set; }

        //*** Utility Methods ***//
        public Location GetCurrentLocation()
        {
            if (CurrentXYZ == null)
            {
                return null;
            }
            return Storage.Current.Locations.Find(CurrentXYZ);
        }
        public Location GetPreviousLocation(Storage Context)
        {
            return Context.Locations.Find(PreviousXYZ);
        }
        public List<Location> GetVisibleLocations()
        {
            List<Location> visibleList = new List<Location>();
            if (CurrentXYZ == null)
            {
                return visibleList;
            }
            var location = Storage.Current.Locations.Find(CurrentXYZ);
            if (location == null)
            {
                return visibleList;
            }
            for (var x = location.XCoord - ViewDistance; x <= location.XCoord + ViewDistance; x++)
            {
                for (var y = location.YCoord - ViewDistance; y <= location.YCoord + ViewDistance; y++)
                {
                    if (Math.Sqrt(
                        Math.Pow(x - location.XCoord, 2) +
                        Math.Pow(y - location.YCoord, 2)
                    ) <= ViewDistance)
                    {
                        var storageID = $"{x.ToString()},{y.ToString()},{location.ZCoord}";
                        if (Storage.Current.Locations.Exists(storageID))
                            visibleList.Add(Storage.Current.Locations.Find(storageID));
                    }
                }
            }
            return visibleList;
        }
        public async Task Move(string[] ToXYZ)
        {
            dynamic request;
            var toLocation = Storage.Current.Locations.Find($"{ToXYZ[0]},{ToXYZ[1]},{ToXYZ[2]}");
            if (toLocation == null)
            {
                toLocation = Location.CreateTempLocation(ToXYZ);
                var area = toLocation.ConvertToArea(true);
                request = new
                {
                    Category = "Events",
                    Type = "AreaCreated",
                    Area = area
                };
                foreach (var player in toLocation.GetNearbyPlayers())
                {
                    player.SendString(JSON.Encode(request));
                }
            }
            
            // TODO: Check if blocked.
            var soul = ConvertToSoul();
            var currentLocation = GetCurrentLocation();
            if (currentLocation == null)
            {
                currentLocation = Location.CreateTempLocation(new string[] { XCoord.ToString(), YCoord.ToString(), ZCoord });
                var area = currentLocation.ConvertToArea(true);
                request = new
                {
                    Category = "Events",
                    Type = "AreaCreated",
                    Area = area
                };
                foreach (var player in currentLocation.GetNearbyPlayers())
                {
                    await player.SendString(JSON.Encode(request));
                }
            }
            MovementState = MovementStates.Moving;
            var distance = currentLocation.GetDistanceFrom(toLocation);
            var travelTime = distance * 1000;
            var nearbyPlayers = currentLocation.GetNearbyPlayers();
            foreach (var player in toLocation.GetNearbyPlayers())
            {
                if (!nearbyPlayers.Contains(player))
                {
                    nearbyPlayers.Add(player);
                }
            }
            await currentLocation.CharacterLeaves(this);
            FutureXYZ = toLocation.StorageID;
            request = JSON.Encode(new
            {
                Category = "Events",
                Type = "PlayerMove",
                Soul = soul,
                From = currentLocation.StorageID,
                To = toLocation.StorageID,
                TravelTime = travelTime
            });
            foreach (var player in nearbyPlayers)
            {
                await player.SendString(request);
            }
            await Task.Run(async () => {
                Thread.Sleep((int)(Math.Round(travelTime)));
                CurrentXYZ = toLocation.StorageID;
                FutureXYZ = null;
                await toLocation.CharacterArrives(this);
                MovementState = MovementStates.Ready;
            });
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
                await (this as Player).GetSocketHandler().SendString(JSON.Encode(request));
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
                    var handler = (this as Player).GetSocketHandler();
                    if (handler == null)
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
                    handler.SendString(JSON.Encode(update));
                }
                foreach (var player in Storage.Current.Locations.Find(CurrentXYZ).GetNearbyPlayers().Where(p=>p?.Player?.Name != Name))
                {
                    dynamic request = new
                    {
                        Category = "Events",
                        Type = "CharacterCharging",
                        Location = CurrentXYZ
                    };
                    player.SendString(JSON.Encode(request));
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
                await (this as Player).GetSocketHandler().SendString(JSON.Encode(request));
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
                    var handler = (this as Player).GetSocketHandler();
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
                    (this as Player).GetSocketHandler().SendString(JSON.Encode(update));
                }
            };
            Timers.Add("ChargeTimer", timer);
            timer.Start();
        }
        public dynamic ConvertToSoul()
        {
            var location = CurrentXYZ.Split(',');
            return new
            {
                Name = this.Name,
                Color = this.Color,
                XCoord = location[0],
                YCoord = location[1],
                ZCoord = location[2],
                CurrentXYZ = this.CurrentXYZ
            };
        }
    }
}
