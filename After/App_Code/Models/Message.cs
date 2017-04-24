using System;
using System.Xml.Serialization;

namespace After.Models
{
    public class Message
    {
        public long MessageID { get; set; }
        public string Channel { get; set; }
        public string Sender { get; set; }
        public string Recipient { get; set; }
        public DateTime? Timestamp { get; set; }
        public string Content { get; set; }
    }
}
