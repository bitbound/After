using After.Code.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Models
{
    public class StatusEffect
    {
        [Key]
        public Guid ID { get; set; }
        public StatusEffectTiming Timing { get; set; }
        public StatusEffectTypes Type { get; set; }
        public double Amount { get; set; }
        public DateTime Expiration { get; set; }
        public TimeSpan Interval { get; set; }
        public DateTime LastTick { get; set; }
    }
}
