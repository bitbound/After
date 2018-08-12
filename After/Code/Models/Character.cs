using After.Code.Interfaces;
using After.Code.Services;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Models
{
    public class Character : GameObject, ICollidable, IDestructible
    {
        public Character()
        {
            CoreEnergy = 100;
            CurrentEnergy = 100;
            CurrentWillpower = 100;
            Height = 50;
            Width = 50;
            XCoord = 0;
            YCoord = 0;
            ZCoord = "0";
            AnchorX = 0;
            AnchorY = 0;
            AnchorZ = "0";
            Color = Utilities.GetRandomHexColor();
            MaxVelocity = 15;
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
                    .Where(x => x.Type == Enums.StatusEffectTypes.MaxEnergy)
                    .Sum(x => x.Amount);
            }
        }
        public double CurrentEnergy { get; set; }


        public double MaxCharge
        {
            get
            {
                return CoreEnergy + StatusEffects
                    .Where(x => x.Type == Enums.StatusEffectTypes.MaxCharge)
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
                    .Where(x => x.Type == Enums.StatusEffectTypes.MaxCharge)
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

        public bool IsDead
        {
            get
            {
                return this.StatusEffects.Exists(x => x.Type == Enums.StatusEffectTypes.Dead);
            }
        }

        public List<StatusEffect> StatusEffects { get; set; } = new List<StatusEffect>();

        public Rectangle Location
        {
            get
            {
                return new Rectangle((int)XCoord, (int)YCoord, Width, Height);
            }
        }

        public bool IsRespawnable { get; protected set; }

        public void OnCollision(ICollidable collidingObject)
        {
           
        }
        public void OnDestruction(string destroyerID)
        {
            var characterID = this.ID;
            if (IsRespawnable)
            {
                MovementForce = 0;
                VelocityX = 0;
                VelocityY = 0;
                CurrentCharge = 0;
                IsCharging = false;
                StatusEffects.Add(new StatusEffect()
                {
                    Type = Enums.StatusEffectTypes.Dead,
                    Timing = Enums.StatusEffectTiming.Constant,
                    Expiration = DateTime.Now.AddSeconds(5)

                });
            }
            GameEngine.Current.InputQueue.Enqueue((dbContext) =>
            {
                var destroyer = dbContext.Characters.Find(destroyerID);
                var character = dbContext.Characters.Find(characterID);
                if (!character.IsRespawnable)
                {
                    dbContext.Characters.Remove(character);
                    dbContext.SaveChanges();
                }
                var gainedEnergy = Math.Round(character.CoreEnergy / destroyer.CoreEnergy) + (Math.Max(0, character.CoreEnergy - destroyer.CoreEnergy));
                destroyer.CoreEnergy += gainedEnergy;
                destroyer.CurrentEnergy += gainedEnergy;
                destroyer.CurrentWillpower += gainedEnergy;
            });
            GameEngine.Current.GameEvents.Add(new GameEvent()
            {
                EventName = "SoulDestroyed",
                EventData = new Dictionary<string, dynamic>() {
                    { "Color", this.Color },
                    { "CharacterID", this.ID }
                },
                XCoord = this.XCoord + this.Width/2,
                YCoord = this.YCoord + this.Height/2,
                ZCoord = this.ZCoord
            });
        }
    }
}
