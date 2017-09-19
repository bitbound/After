using After.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Models
{
    public class Occupant
    {
        public Occupant (Character CharacterObject)
        {
            this.DisplayName = CharacterObject.Name;
            this.StorageID = CharacterObject.StorageID;
        }
        public string DisplayName { get; set; }
        public string StorageID { get; set; }
    }
}
