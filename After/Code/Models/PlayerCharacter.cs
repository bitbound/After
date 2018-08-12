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
            this.IsRespawnable = true;
        }
    }
}
