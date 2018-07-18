using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace After.Data
{
    public class Error
    {
        [Key]
        public int ID { get; set; }
        public string PathWhereOccurred { get; set; }
        public string User { get; set; }
        public string Message { get; set; }
        public string StackTrace { get; set; }
        public string Source { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
