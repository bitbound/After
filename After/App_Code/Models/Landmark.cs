using StorageLists;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace After.Models
{
    public class Landmark : IStorageItem
    {
        public double XCoord { get; set; }
        public double YCoord { get; set; }
        public string ZCoord { get; set; }
        public string StorageID
        {
            get
            {
                return XCoord.ToString() + "," + YCoord.ToString() + "," + ZCoord.ToString();
            }
            set
            {
                var split = value.Split(',');
                XCoord = double.Parse(split[0]);
                YCoord = double.Parse(split[1]);
                ZCoord = split[2];
            }
        }
        public string Text { get; set; }
        public int FontSize { get; set; }
        public string FontStyle { get; set; }
        public string Color { get; set; } = "white";
        public DateTime LastAccessed { get; set; }
        public dynamic ConvertToDynamic()
        {
            return new
            {
                XCoord = this.XCoord,
                YCoord = this.YCoord,
                ZCoord = this.ZCoord,
                StorageID = this.StorageID,
                Color = this.Color,
                Text = this.Text,
                FontSize = this.FontSize,
                FontStyle = this.FontStyle
            };
        }
    }
}