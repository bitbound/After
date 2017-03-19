using System;
using System.Xml.Serialization;

namespace After.Models
{
    public class Message
    {
        public string MessageID { get; set; }
        public MessageTypes Type { get; set; }
        public string Sender { get; set; }
        public string Recipient { get; set; }
        public DateTime? Timestamp { get; set; }
        public string Content { get; set; }

        public string ChannelName
        {
            get
            {
                return "Channel" + Type.ToString();
            }
        }
        public enum MessageTypes
        {
            Admin,
            System,
            GlobalEvent,
            LocalEvent,
            GlobalChat,
            LocalChat,
            Private,
            Connection,
        }
    }
}
