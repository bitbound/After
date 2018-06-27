using After.Dependencies.StorageLists;
using System;

namespace After.Data
{
    public class Message : IStorageItem
    {
        public string StorageID { get; set; }
        public string Channel { get; set; }
        public string Sender { get; set; }
        public string Recipient { get; set; }
        public DateTime? Timestamp { get; set; }
        public string Content { get; set; }
        public DateTime LastAccessed { get; set; }
    }
}
