using System;
using System.Collections.Generic;

namespace After.Data
{
    public class InnerVoid
    {
        public InnerVoid()
        {
        }
		public Guid OwnerID { get; set; }
		
        public Location StartLocation { get; set; }

        public List<Location> AreaInformation { get; set; } = new List<Location>();

    }
}
