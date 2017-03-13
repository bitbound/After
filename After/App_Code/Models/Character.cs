using After.Interactions;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Xml.Serialization;

namespace After.Models
{
    public class Character
    {
        public Character()
        {
        }
        public Guid ID { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public string Color { get; set; } = "gray";
        public string PortraitUri { get; set; }
        private double coreEnergyPeak;
        public double CoreEnergyPeak
        {
            get
            {
                if (coreEnergyPeak == 0)
                {
                    coreEnergyPeak = CoreEnergy;
                }
                return coreEnergyPeak;
            }
            set
            {
                coreEnergyPeak = value;
            }
        }
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
        private double maxEnergyModifier;
        public double MaxEnergyModifier
        {
            get
            {
                return maxEnergyModifier;
            }
            set
            {
                maxEnergyModifier = value;
            }
        }
        public double MaxEnergy
        {
            get
            {
                return CoreEnergy + MaxEnergyModifier;
            }
        }
        private double currentEnergy;
        public double CurrentEnergy
        {
            get
            {
                return currentEnergy;
            }
            set
            {
                currentEnergy = value;
            }
        }
        public double EnergyPercent
        {
            get
            {
                return CurrentEnergy / MaxEnergy;
            }
        }
        private double maxChargeModifier;
        public double MaxChargeModifier
        {
            get
            {
                return maxChargeModifier;
            }
            set
            {
                maxChargeModifier = value;
            }
        }
        public double MaxCharge
        {
            get
            {
                return CoreEnergy + MaxChargeModifier;
            }
        }
        private double currentCharge;
        public double CurrentCharge
        {
            get
            {
                return currentCharge;
            }
            set
            {
                currentCharge = value;
            }
        }
        public double ChargePercent
        {
            get
            {
                return CurrentCharge / MaxCharge;
            }
        }
        private double maxWillpowerModifier;
        public double MaxWillpowerModifier
        {
            get
            {
                return maxWillpowerModifier;
            }
            set
            {
                maxWillpowerModifier = value;
            }
        }
        public double MaxWillpower
        {
            get
            {
                return CoreEnergy + MaxWillpowerModifier;
            }
        }
        private double currentWillpower;
        public double CurrentWillpower
        {
            get
            {
                return currentWillpower;
            }
            set
            {
                currentWillpower = value;
            }
        }
        public double WillpowerPercent
        {
            get
            {
                return CurrentWillpower / MaxWillpower;
            }
        }
        public string PreviousXYZ { get; set; }
        private Location previousLocation;

        public Location PreviousLocation
        {
            get
            {
                if (previousLocation == null && PreviousXYZ != null)
                {
                    return new Location() { XCoord = int.Parse(PreviousXYZ.Split(',')[0]), YCoord = int.Parse(PreviousXYZ.Split(',')[1]), ZCoord = PreviousXYZ.Split(',')[2] };
                }
                else if (previousLocation == null)
                {
                    return previousLocation;
                }
                else
                {
                    return CurrentLocation;
                }
            }
            set
            {
                previousLocation = value;
                PreviousXYZ = value?.XYZ;
            }
        }
        public string CurrentXYZ { get; set; }
        private Location currentLocation;
        public Location CurrentLocation
        {
            get
            {
                if (currentLocation == null && CurrentXYZ != null)
                {
                    return new Location() { XCoord = int.Parse(CurrentXYZ.Split(',')[0]), YCoord = int.Parse(CurrentXYZ.Split(',')[1]), ZCoord = CurrentXYZ.Split(',')[2] };
                }
                return currentLocation;
            }
            set
            {
                currentLocation = value;
                CurrentXYZ = value?.XYZ;
            }
        }

        public double ViewDistance { get; set; } = 2;

        public bool IsCharging { get; set; }

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
        public bool IsHostile()
        {
            return false;
        }
        public bool IsHostile(Character ToCharacter)
        {
            return false;
        }

        public List<BaseInteraction> Interactions { get; set; }

    }
}
