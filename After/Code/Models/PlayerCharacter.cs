using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Models
{
    public class PlayerCharacter : Character
    {
        public PlayerCharacter()
        {
            this.MaxVelocity = 20;
            this.AccelerationSpeed = 4;
            this.DecelerationSpeed = 2;
        }
    }
}
