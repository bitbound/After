using System;

namespace StorageLists
{
    public interface IStorageItem
    {
        string StorageID { get; set; }
        DateTime LastAccessed { get; set; }
    }
}