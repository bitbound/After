using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace After.Data
{
    public class Character : IGameObject
    {
        public string Color { get; set; } = "gray";
        public string PortraitUri { get; set; }
        public int Height { get; set; } = 20;
        public bool IsCollisionEnabled { get; set; } = true;
        public int Width { get; set; } = 20;
        public double XCoord { get; set; } = 0;
        public double YCoord { get; set; } = 0;
        public double ZCoord { get; set; } = 0;


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

        public double CurrentCharge { get; set; }


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


        public Rectangle Rect
        {
            get
            {
                return new Rectangle((int)XCoord, (int)YCoord, Width, Height);
            }
        }
    }
}
