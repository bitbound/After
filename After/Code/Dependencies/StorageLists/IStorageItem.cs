using System;

namespace After.Dependencies.StorageLists
{
    public interface IStorageItem
    {
        string StorageID { get; set; }
        DateTime LastAccessed { get; set; }
    }
}