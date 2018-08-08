using After.Code.Interfaces;
using After.Code.Services;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Models
{
    public class Character : GameObject, ICollidable
    {
        public Character()
        {
            CoreEnergy = 100;
            CurrentEnergy = 100;
            CurrentWillpower = 100;
            Height = 25;
            Width = 25;
            XCoord = 0;
            YCoord = 0;
            ZCoord = "0";
            Color = Utilities.GetRandomHexColor();
            MaxVelocity = 10;
            AccelerationSpeed = 2;
            DecelerationSpeed = 1;
        }
      
        public string Name { get; set; }
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
        public double MaxEnergy
        {
            get
            {
                return CoreEnergy + StatusEffects
                    .Where(x => x.Target == Enums.StatusEffectTargets.MaxEnergy)
                    .Sum(x => x.Amount);
            }
        }
        public double CurrentEnergy { get; set; }


        public double MaxCharge
        {
            get
            {
                return CoreEnergy + StatusEffects
                    .Where(x => x.Target == Enums.StatusEffectTargets.MaxCharge)
                    .Sum(x => x.Amount);
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


        public double MaxWillpower
        {
            get
            {
                return CoreEnergy + StatusEffects
                    .Where(x => x.Target == Enums.StatusEffectTargets.MaxCharge)
                    .Sum(x => x.Amount);
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

        public bool IsCharging { get; set; }

        public List<StatusEffect> StatusEffects { get; set; } = new List<StatusEffect>();

        public Rectangle Location
        {
            get
            {
                return new Rectangle((int)XCoord, (int)YCoord, Width, Height);
            }
        }

        
        public void OnCollision(ICollidable collidingObject)
        {
            throw new NotImplementedException();
        }
    }
}
