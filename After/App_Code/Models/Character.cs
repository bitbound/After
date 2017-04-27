using After.Interactions;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web.Script.Serialization;

namespace After.Models
{
    public class Character
    {
        public Character()
        {
            CoreEnergy = 100;
            CoreEnergyPeak = 100;
            CurrentEnergy = 100;
            CurrentCharge = 0;
            CurrentWillpower = 100;
        }
        public long CharacterID { get; set; }
        public string Name { get; set; }
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
       
        public string CurrentXYZ { get; set; }
        public double ViewDistance { get; set; } = 2;

        public bool IsCharging { get; set; }
        public string Interactions { get; set; }

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
        public string Flags { get; set; }
        public bool IsHostile()
        {
            return false;
        }
        public bool IsHostile(Character ToCharacter)
        {
            return false;
        }
        public Location GetCurrentLocation(Socket_Handler SH)
        {
            return SH.World.Locations.FirstOrDefault(l => l.LocationID == CurrentXYZ);
        }
        public Location GetPreviousLocation(Socket_Handler SH)
        {
            return SH.World.Locations.FirstOrDefault(l => l.LocationID == PreviousXYZ);
        }
        public dynamic ConvertToSoul()
        {
            var location = CurrentXYZ.Split(',');
            return new
            {
                CharacterID = this.CharacterID,
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
