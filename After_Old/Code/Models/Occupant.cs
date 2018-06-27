using After.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Data
{
    public class Occupant
    {
        public string DisplayName { get; set; }
        public string StorageID { get; set; }

        public OccupantTypes OccupantType { get; set; }
    }
}
