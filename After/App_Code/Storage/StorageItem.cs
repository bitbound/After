using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace StorageLists
{
    public interface StorageItem
    {
        string StorageID { get; set; }
        DateTime LastAccessed { get; set; }
    }
}