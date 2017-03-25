using System;
using System.Xml.Serialization;

namespace After.Models
{
    public class Message
    {
        public long MessageID { get; set; }
        public Message_Types Message_Type { get; set; }
        public string Sender { get; set; }
        public string Recipient { get; set; }
        public DateTime? Timestamp { get; set; }
        public string Content { get; set; }

        public string ChannelName
        {
            get
            {
                return "Channel" + Message_Type.ToString();
            }
        }
        public enum Message_Types
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
